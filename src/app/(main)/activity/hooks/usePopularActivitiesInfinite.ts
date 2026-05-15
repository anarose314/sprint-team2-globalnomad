import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPopularActivities } from '@/app/(main)/activity/apis/activities';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';
import { createCursorInfiniteOptions } from '@/shared/utils/createCursorInfiniteOptions';

/**
 * 서버 프리패칭과 클라이언트 훅에서 공통으로 사용하는 인기 체험 쿼리 옵션
 */
export const popularActivitiesOptions = () =>
  createCursorInfiniteOptions(
    QUERY_KEYS.POPULAR_ACTIVITIES,
    fetchPopularActivities
  );

/**
 * 메인 페이지 인기 체험 목록에서 사용하는 무한 스크롤 커스텀 훅
 *
 * @example
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
 *   usePopularActivitiesInfinite();
 */
export const usePopularActivitiesInfinite = () => {
  return useInfiniteQuery(popularActivitiesOptions());
};
