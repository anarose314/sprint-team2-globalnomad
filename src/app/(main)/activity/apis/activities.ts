import type {
  ActivitiesResponse,
  FetchActivitiesParams,
} from '@/app/(main)/activity/apis/activities.types';
import { fetchInstance } from '@/shared/apis/fetchInstance.core';

/**
 * 체험 목록을 조회하는 API 함수
 *
 * - PR1에서는 모든 체험 목록을 최신순 페이지네이션으로 조회한다.
 * - 검색, 카테고리, 가격 정렬은 이후 작업에서 파라미터를 확장한다.
 *
 * @example
 * fetchActivities({ method: 'offset', page: 1, size: 6, sort: 'latest' })
 */
export const fetchActivities = async ({
  method,
  page,
  size,
  sort = 'latest',
}: FetchActivitiesParams) => {
  return await fetchInstance<ActivitiesResponse>('/activities', {
    method: 'GET',
    params: {
      method,
      page,
      size,
      sort,
    },
    cache: 'no-store',
  });
};
