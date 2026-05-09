import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';
import {
  Activities,
  MyActivitiesResponse,
} from '@/shared/types/myActivities.types';

const DASHBOARD_MY_ACTIVITIES_SIZE = 20;

/**
 * 예약 현황 페이지 드롭다운에 노출할 내 체험 목록 한 개의 페이지 조회
 */
export const fetchMyActivitiesForDashboard = async (): Promise<
  Activities[]
> => {
  const response = await fetchInstanceClient<MyActivitiesResponse>(
    '/api/proxy/my-activities',
    {
      params: {
        size: DASHBOARD_MY_ACTIVITIES_SIZE,
      },
    }
  );

  return response.activities;
};
