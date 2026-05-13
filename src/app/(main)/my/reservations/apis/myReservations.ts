import {
  FetchMyReservations,
  PatchMyReservation,
  PostReviews,
  ReviewResponse,
} from '@/app/(main)/my/reservations/apis/myReservations.types';
import { MY_RESERVATIONS_SIZE } from '@/app/(main)/my/reservations/reservations.constants';
import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';
import { MyReservationsResponse } from '@/shared/types/myReservation.types';

/**
 * 예약 내역을 가져오는 API 호출 함수 (BFF 경유)
 */
export const fetchMyReservations = async ({
  pageParam = null,
  status = null,
}: FetchMyReservations) => {
  const params = {
    size: MY_RESERVATIONS_SIZE,
    ...(pageParam !== null && { cursorId: pageParam }),
    ...(status && { status }),
  };

  return await fetchInstanceClient<MyReservationsResponse>(
    '/api/proxy/my-reservations',
    { params }
  );
};

/**
 * 체험에 대한 리뷰를 작성하는 API 호출 함수 (BFF 경유)
 */
export const postReviews = ({ reservationId, body }: PostReviews) => {
  return fetchInstanceClient<ReviewResponse>(
    `/api/proxy/my-reservations/${reservationId}/reviews`,
    {
      method: 'POST',
      body,
    }
  );
};

/**
 * 예약을 취소하는 API 호출 함수 (BFF 경유)
 */
export const patchMyReservation = async ({
  reservationId,
}: PatchMyReservation) => {
  return await fetchInstanceClient(
    `/api/proxy/my-reservations/${reservationId}`,
    {
      method: 'PATCH',
      body: {
        status: 'canceled',
      },
    }
  );
};
