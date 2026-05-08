import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchMyReservations } from '@/app/(main)/my/reservations/apis/myReservations';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';
import { MyReservationsResponse } from '@/shared/types/myReservation.types';

/**
 * 예약 내역 페이지에서 사용하는 무한 스크롤 커스텀 훅
 * 서버 컴포넌트에서 초기 데이터(initialData)를 주입받아 하이드레이션 없이 빠른 초기 렌더링 지원
 *
 * @example
 * ```ts
 * // 컴포넌트 내부에서 사용 시
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useMyReservations(initialData);
 * ```
 */
export const useMyReservations = (initialData: MyReservationsResponse) => {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.MY_RESERVATIONS,
    queryFn: fetchMyReservations,
    initialPageParam: null,

    getNextPageParam: (lastPage) => lastPage.cursorId ?? undefined,

    initialData: {
      pages: [initialData],
      pageParams: [null],
    },
  });
};
