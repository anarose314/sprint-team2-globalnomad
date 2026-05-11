import { useQuery } from '@tanstack/react-query';
import { fetchActivities } from '@/app/(main)/activity/apis/activities';
import type { FetchActivitiesParams } from '@/app/(main)/activity/apis/activities.types';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';

/**
 * 서버 프리패칭과 클라이언트 훅에서 공통으로 사용하는 체험 목록 쿼리 옵션
 */
export const activitiesOptions = (params: FetchActivitiesParams) => ({
  queryKey: [...QUERY_KEYS.ACTIVITIES, params],
  queryFn: () => fetchActivities(params),
});

/**
 * 메인 페이지 모든 체험 목록 조회 훅
 *
 * @example
 * const { data, isPending, isError } = useActivities({
 *   method: 'offset',
 *   page: 1,
 *   size: 6,
 *   sort: 'latest',
 * });
 */
export const useActivities = (params: FetchActivitiesParams) => {
  return useQuery(activitiesOptions(params));
};
