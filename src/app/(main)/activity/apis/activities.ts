import type {
  ActivitiesResponse,
  FetchActivitiesParams,
} from '@/app/(main)/activity/apis/activities.types';
import { fetchInstance } from '@/shared/apis/fetchInstance.core';

/**
 * 체험 목록을 조회하는 API 함수
 *
 * - 모든 체험 목록을 페이지네이션 방식으로 조회한다.
 * - 검색어, 카테고리, 정렬 조건을 선택적으로 전달할 수 있다.
 *
 * @example
 * fetchActivities({
 *   method: 'offset',
 *   page: 1,
 *   size: 6,
 *   sort: 'latest',
 *   category: '투어',
 *   keyword: '댄스',
 * })
 */
export const fetchActivities = async ({
  method,
  page,
  size,
  sort = 'latest',
  category,
  keyword,
}: FetchActivitiesParams) => {
  return await fetchInstance<ActivitiesResponse>('/activities', {
    method: 'GET',
    params: {
      method,
      page,
      size,
      sort,
      category,
      keyword,
    },
    cache: 'no-store',
  });
};
