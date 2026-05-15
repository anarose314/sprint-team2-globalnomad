import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';

interface MyReservationsResponse {
  reservations?: Array<{
    scheduleId?: number;
    status?: string;
    activity?: { id?: number };
  }>;
}

export interface MyReservedScheduleItem {
  activityId: number;
  scheduleId: number;
}

/**
 * 내 예약 목록에서 예약 차단 대상(activityId/scheduleId) 목록을 조회합니다.
 */
export const fetchMyReservedSchedules = async (): Promise<
  MyReservedScheduleItem[]
> => {
  const response = await fetchInstanceClient<MyReservationsResponse>(
    '/api/proxy/my-reservations',
    {
      params: { size: 100 },
    }
  );

  const reservations = Array.isArray(response?.reservations)
    ? response.reservations
    : [];

  const blockedStatuses = new Set(['pending', 'confirmed', 'completed']);

  return reservations
    .filter(
      (reservation) =>
        typeof reservation?.activity?.id === 'number' &&
        typeof reservation.scheduleId === 'number' &&
        blockedStatuses.has(reservation.status ?? '')
    )
    .map((reservation) => ({
      activityId: reservation.activity!.id as number,
      scheduleId: reservation.scheduleId as number,
    }));
};
