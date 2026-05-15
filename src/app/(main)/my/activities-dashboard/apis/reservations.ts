import { ApiError } from '@/shared/apis/apiError';
import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';

const RESERVATION_PAGE_SIZE = 10;
type ReservationRequestStatus =
  | 'pending'
  | 'confirmed'
  | 'declined'
  | 'completed';

interface ReservationRequestItem {
  id: number;
  nickname: string;
  headCount: number;
  scheduleId: number;
  status: ReservationRequestStatus;
  createdAt: string;
}

interface ReservationRequestsResponse {
  cursorId: number | null;
  totalCount: number;
  reservations: ReservationRequestItem[];
}

interface FetchActivityReservationsProps {
  activityId: number;
  scheduleId: number;
  status: ReservationRequestStatus;
  cursorId?: number | null;
}

interface UpdateActivityReservationStatusProps {
  activityId: number;
  reservationId: number;
  status: 'confirmed' | 'declined';
}

interface ApproveReservationWithAutoDeclineProps {
  activityId: number;
  reservationId: number;
  scheduleId: number;
}

interface ActivityReservationsResponseLike {
  cursorId?: unknown;
  totalCount?: unknown;
  reservations?: unknown;
}

/**
 * 특정 체험/스케줄/상태 기준 예약 내역 목록을 커서 페이징으로 조회
 */
export const fetchActivityReservations = async ({
  activityId,
  scheduleId,
  status,
  cursorId = null,
}: FetchActivityReservationsProps): Promise<ReservationRequestsResponse> => {
  const response = await fetchInstanceClient<unknown>(
    `/api/proxy/my-activities/${activityId}/reservations`,
    {
      params: {
        scheduleId,
        status,
        size: RESERVATION_PAGE_SIZE,
        ...(cursorId !== null && { cursorId }),
      },
    }
  );

  const normalized =
    response && typeof response === 'object'
      ? (response as ActivityReservationsResponseLike)
      : {};

  const reservations = Array.isArray(normalized.reservations)
    ? normalized.reservations
    : [];

  return {
    cursorId:
      typeof normalized.cursorId === 'number' ? normalized.cursorId : null,
    totalCount:
      typeof normalized.totalCount === 'number' ? normalized.totalCount : 0,
    reservations: reservations
      .map((item) => {
        if (!item || typeof item !== 'object') return null;

        const reservation = item as {
          id?: unknown;
          nickname?: unknown;
          headCount?: unknown;
          scheduleId?: unknown;
          status?: unknown;
          createdAt?: unknown;
        };

        const isStatusValid =
          reservation.status === 'pending' ||
          reservation.status === 'confirmed' ||
          reservation.status === 'declined' ||
          reservation.status === 'completed';

        if (
          typeof reservation.id !== 'number' ||
          typeof reservation.nickname !== 'string' ||
          typeof reservation.headCount !== 'number' ||
          typeof reservation.scheduleId !== 'number' ||
          !isStatusValid ||
          typeof reservation.createdAt !== 'string'
        ) {
          return null;
        }

        return {
          id: reservation.id,
          nickname: reservation.nickname,
          headCount: reservation.headCount,
          scheduleId: reservation.scheduleId,
          status: reservation.status,
          createdAt: reservation.createdAt,
        };
      })
      .filter(
        (item): item is ReservationRequestsResponse['reservations'][number] =>
          item !== null
      ),
  };
};

/**
 * 내 체험 예약 상태를 승인/거절로 변경한다.
 */
export const updateActivityReservationStatus = async ({
  activityId,
  reservationId,
  status,
}: UpdateActivityReservationStatusProps): Promise<void> => {
  await fetchInstanceClient(
    `/api/proxy/my-activities/${activityId}/reservations/${reservationId}`,
    {
      method: 'PATCH',
      body: { status },
    }
  );
};

/**
 * 승인 시 동시간대 대기 예약 자동 거절을 백엔드 단일 트랜잭션으로 시도한다.
 * - 미지원(404/405/501)인 경우 false를 반환하고, 호출부에서 클라이언트 폴백을 수행한다.
 */
export const approveReservationWithAutoDecline = async ({
  activityId,
  reservationId,
  scheduleId,
}: ApproveReservationWithAutoDeclineProps): Promise<boolean> => {
  try {
    await fetchInstanceClient(
      `/api/proxy/my-activities/${activityId}/reservations/${reservationId}/approve`,
      {
        method: 'PATCH',
        body: { scheduleId },
      }
    );
    return true;
  } catch (error) {
    if (error instanceof ApiError) {
      const unsupportedStatuses = [404, 405, 501];
      if (unsupportedStatuses.includes(error.status)) {
        return false;
      }
    }
    throw error;
  }
};
