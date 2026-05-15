import { MY_ACTIVITIES_SIZE } from '@/app/(main)/my/activities/activities.constants';
import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';
import { MyActivitiesResponse } from '@/shared/types/myActivities.types';

interface FetchMyActivitiesProps {
  pageParam?: number | null;
}

/**
 * 내 체험 리스트를 가져오는 API 호출 함수 (BFF 경유)
 */
export const fetchMyActivities = async ({
  pageParam = null,
}: FetchMyActivitiesProps) => {
  const params = {
    size: MY_ACTIVITIES_SIZE,
    ...(pageParam !== null && { cursorId: pageParam }),
  };

  return await fetchInstanceClient<MyActivitiesResponse>(
    '/api/proxy/my-activities',
    { params }
  );
};
