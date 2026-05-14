import type {
  ActivitiesResponse,
  ActivityImageResponse,
  FetchActivitiesParams,
  PostActivities,
  PostActivitiesResponse,
} from '@/app/(main)/activity/apis/activities.types';
import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';
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

/**
 * 체험 이미지를 서버(S3)에 업로드하고 URL을 반환받는 API (BFF 경유)
 */
export const postActivityImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  return await fetchInstanceClient<ActivityImageResponse>(
    '/api/proxy/activities/image',
    {
      method: 'POST',
      body: formData,
    }
  );
};

/**
 * 체험 등록을 하는 API 호출 함수 (BFF 경유)
 */
export const postActivities = async (body: PostActivities) => {
  return await fetchInstanceClient<PostActivitiesResponse>(
    `/api/proxy/activities`,
    {
      method: 'POST',
      body,
    }
  );
};
