import type {
  ActivitiesResponse,
  ActivityImageResponse,
  FetchActivitiesParams,
} from '@/app/(main)/activity/apis/activities.types';
import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';
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
