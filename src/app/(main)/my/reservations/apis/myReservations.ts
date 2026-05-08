import { MY_RESERVATIONS_SIZE } from '@/app/(main)/my/reservations/reservations.constants';
import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';
import { MyReservationsResponse } from '@/shared/types/myReservation.types';

interface FetchMyReservations {
  pageParam?: number | null;
}

/**
 * 예약 내역을 가져오는 API 호출 함수 (BFF 경유)
 */
export const fetchMyReservations = async ({
  pageParam = null,
}: FetchMyReservations) => {
  const params = {
    size: MY_RESERVATIONS_SIZE,
    ...(pageParam !== null && { cursorId: pageParam }),
  };

  return await fetchInstanceClient<MyReservationsResponse>(
    '/api/my-reservations',
    {
      params,
    }
  );
};
