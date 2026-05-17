import { ApiError } from '@/shared/apis/apiError';
import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';

const RESERVATION_PAGE_SIZE = 10;
/** 대기 예약 일괄 거절 시 동시 PATCH 상한(동시 연결·서버 부하 완화) */
const DECLINE_PENDING_RESERVATIONS_CONCURRENCY = 5;
type ReservationRequestStatus = 'pending' | 'confirmed' | 'declined';

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
  /** 목록 조회 page size, 생략 시 UI 목록과 동일한 페이지 크기(10) */
  size?: number;
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
  size = RESERVATION_PAGE_SIZE,
}: FetchActivityReservationsProps): Promise<ReservationRequestsResponse> => {
  const response = await fetchInstanceClient<unknown>(
    `/api/proxy/my-activities/${activityId}/reservations`,
    {
      params: {
        scheduleId,
        status,
        size,
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
 * 내 체험 예약 상태를 승인/거절로 변경
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

interface CollectPendingReservationIdsForScheduleProps {
  activityId: number;
  scheduleId: number;
  excludeReservationId?: number | null;
}

/**
 * 스케줄 단위로 대기(pending) 예약 id를 커서 페이징으로 모두 수집
 * UI 목록(10건)보다 큰 페이지로 조회해 왕복 횟수를 줄임
 */
export const collectPendingReservationIdsForSchedule = async ({
  activityId,
  scheduleId,
  excludeReservationId = null,
}: CollectPendingReservationIdsForScheduleProps): Promise<number[]> => {
  const ids: number[] = [];
  const visitedCursorIds = new Set<number>();
  let cursorId: number | null = null;

  do {
    const pendingPage = await fetchActivityReservations({
      activityId,
      scheduleId,
      status: 'pending',
      cursorId,
      size: 50,
    });

    pendingPage.reservations.forEach((reservation) => {
      if (
        excludeReservationId !== null &&
        reservation.id === excludeReservationId
      ) {
        return;
      }
      ids.push(reservation.id);
    });

    if (
      pendingPage.cursorId !== null &&
      visitedCursorIds.has(pendingPage.cursorId)
    ) {
      break;
    }
    if (pendingPage.cursorId !== null) {
      visitedCursorIds.add(pendingPage.cursorId);
    }

    cursorId = pendingPage.cursorId;
  } while (cursorId !== null);

  return ids;
};

/**
 * 대기 예약 id 목록 일괄 거절
 * 한 스케줄에 대기 건이 매우 많을 수 있어 전부 병렬로 보내지 않고 청크 단위로 나눈다.
 * 청크 내 한 건이 실패해도 나머지는 계속 처리한다(`Promise.allSettled`).
 */
export const declinePendingReservationIds = async (
  activityId: number,
  reservationIds: number[]
): Promise<void> => {
  if (reservationIds.length === 0) return;

  const rejectionReasons: unknown[] = [];

  for (
    let offset = 0;
    offset < reservationIds.length;
    offset += DECLINE_PENDING_RESERVATIONS_CONCURRENCY
  ) {
    const chunk = reservationIds.slice(
      offset,
      offset + DECLINE_PENDING_RESERVATIONS_CONCURRENCY
    );
    const results = await Promise.allSettled(
      chunk.map((reservationId) =>
        updateActivityReservationStatus({
          activityId,
          reservationId,
          status: 'declined',
        })
      )
    );

    for (const result of results) {
      if (result.status === 'rejected') {
        rejectionReasons.push(result.reason);
      }
    }
  }

  if (rejectionReasons.length > 0) {
    const first = rejectionReasons[0];
    if (first instanceof Error) throw first;
    throw new Error(String(first ?? '일부 예약 거절에 실패했습니다.'));
  }
};

/**
 * 승인 시 동시간대 대기 예약 자동 거절을 백엔드 단일 트랜잭션으로 시도
 * - 미지원(404/405/501)인 경우 false를 반환하고, 호출부에서 클라이언트 폴백 수행
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
