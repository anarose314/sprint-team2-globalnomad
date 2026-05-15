import type {
  ActivitiesResponse,
  ActivityImageResponse,
  ActivityMutationResponse,
  FetchActivitiesParams,
  FetchPopularActivitiesParams,
  PatchActivities,
  PostActivities,
} from '@/app/(main)/activity/apis/activities.types';
import { POPULAR_ACTIVITY_PAGE_SIZE } from '@/app/(main)/main.constants';
import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';
import { fetchInstance } from '@/shared/apis/fetchInstance.core';
import { ActivityDetailResponse } from '@/shared/types/activityDetail.types';

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
 * 인기 체험 목록을 커서 기반으로 조회하는 API 함수
 *
 * - 댓글 수가 많은 순으로 인기 체험을 조회한다.
 * - 첫 요청에서는 cursorId를 보내지 않는다.
 * - 응답 cursorId가 0이어도 다음 요청에 포함해야 하므로 null 여부로만 분기한다.
 *
 * @example
 * fetchPopularActivities({ pageParam: null })
 */
export const fetchPopularActivities = async ({
  pageParam = null,
}: FetchPopularActivitiesParams) => {
  const params = {
    method: 'cursor',
    size: POPULAR_ACTIVITY_PAGE_SIZE,
    sort: 'most_reviewed',
    ...(pageParam !== null && { cursorId: pageParam }),
  };

  return await fetchInstance<ActivitiesResponse>('/activities', {
    method: 'GET',
    params,
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
  return await fetchInstanceClient<ActivityMutationResponse>(
    `/api/proxy/activities`,
    {
      method: 'POST',
      body,
    }
  );
};

/**
 * 체험 수정을 하는 API 호출 함수 (BFF 경유)
 */
export const patchActivities = async ({
  activityId,
  body,
}: PatchActivities) => {
  return await fetchInstanceClient<ActivityMutationResponse>(
    `/api/proxy/my-activities/${activityId}`,
    {
      method: 'PATCH',
      body,
    }
  );
};

/**
 * 특정 체험 1개의 상세 정보를 조회하는 API 함수
 */
export const fetchActivityDetail = async (activityId: number) => {
  return await fetchInstance<ActivityDetailResponse>(
    `/activities/${activityId}`,
    {
      method: 'GET',
      cache: 'no-store',
    }
  );
};

/**
 * 체험 삭제를 하는 API 호출 함수 (BFF 경유)
 */
export const deleteActivity = async (activityId: number) => {
  return await fetchInstanceClient<void>(
    `/api/proxy/my-activities/${activityId}`,
    {
      method: 'DELETE',
    }
  );
};
