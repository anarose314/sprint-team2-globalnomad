import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { fetchMyReservations } from '@/app/(main)/my/reservations/apis/myReservations';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';
import { createCursorInfiniteOptions } from '@/shared/utils/createCursorInfiniteOptions';

/**
 * 서버 프리패칭과 클라이언트 훅에서 공통으로 사용하는 예약 내역 쿼리 옵션
 */
export const myReservationsOptions = (status?: string | null) =>
  createCursorInfiniteOptions(
    [QUERY_KEYS.MY_RESERVATIONS, status],
    ({ pageParam }) => fetchMyReservations({ pageParam, status })
  );

/**
 * 예약 내역 페이지에서 사용하는 무한 스크롤 커스텀 훅
 *
 * @example
 * ```ts
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useMyReservations();
 * ```
 */
export const useMyReservations = (status?: string | null) => {
  return useInfiniteQuery({
    ...myReservationsOptions(status),
    placeholderData: keepPreviousData,
  });
};
