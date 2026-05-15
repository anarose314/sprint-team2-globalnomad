import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchMyActivities } from '@/app/(main)/my/activities/apis/myActivities';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';
import { createCursorInfiniteOptions } from '@/shared/utils/createCursorInfiniteOptions';

/**
 * 서버 프리패칭과 클라이언트 훅에서 공통으로 사용하는 내 체험 관리 쿼리 옵션
 */
export const myActivitiesOptions = () =>
  createCursorInfiniteOptions(QUERY_KEYS.MY_ACTIVITIES, fetchMyActivities);

/**
 * 내 체험 관리 페이지에서 사용하는 무한 스크롤 커스텀 훅
 *
 * @example
 * ```ts
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useMyActivitiesInfinite();
 * ```
 */
export const useMyActivitiesInfinite = () => {
  return useInfiniteQuery(myActivitiesOptions());
};
