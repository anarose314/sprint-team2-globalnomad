import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';
import { ActivityAvailableScheduleItem } from '@/shared/types/activityDetail.types';

interface FetchActivityAvailableScheduleProps {
  activityId: number;
}

/**
 * 체험 예약 가능일/시간 조회
 */
export const fetchActivityAvailableSchedule = async ({
  activityId,
}: FetchActivityAvailableScheduleProps): Promise<
  ActivityAvailableScheduleItem[]
> => {
  return fetchInstanceClient<ActivityAvailableScheduleItem[]>(
    `/api/proxy/activities/${activityId}/available-schedule`
  );
};
