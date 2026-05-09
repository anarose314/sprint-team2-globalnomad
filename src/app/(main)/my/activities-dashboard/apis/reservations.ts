import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';
import { MyActivityReservationsResponse } from '@/shared/types/myActivityReservations.types';

const RESERVATION_PAGE_SIZE = 10;

interface FetchActivityReservationsProps {
  activityId: number;
  scheduleId: number;
  status: 'pending' | 'confirmed' | 'declined';
  cursorId?: number | null;
}

interface ActivityReservationsResponseLike {
  cursorId?: unknown;
  totalCount?: unknown;
  reservations?: unknown;
}

/**
 * 특정 체험/스케줄/상태 기준 예약 내역 목록을 커서 페이징으로 조회한다.
 */
export const fetchActivityReservations = async ({
  activityId,
  scheduleId,
  status,
  cursorId = null,
}: FetchActivityReservationsProps): Promise<MyActivityReservationsResponse> => {
  const response = await fetchInstanceClient<unknown>(
    `/api/my-activities/${activityId}/reservations`,
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
          reservation.status === 'declined';

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
        (
          item
        ): item is MyActivityReservationsResponse['reservations'][number] =>
          item !== null
      ),
  };
};
