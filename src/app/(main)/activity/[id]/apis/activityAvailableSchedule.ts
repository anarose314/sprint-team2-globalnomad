import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';
import { ActivityAvailableScheduleItem } from '@/shared/types/activityDetail.types';

interface FetchActivityAvailableScheduleProps {
  activityId: number;
  year: number;
  month: number;
}

/**
 * 체험 예약 가능일/시간 조회
 */
export const fetchActivityAvailableSchedule = async ({
  activityId,
  year,
  month,
}: FetchActivityAvailableScheduleProps): Promise<
  ActivityAvailableScheduleItem[]
> => {
  const params = {
    year,
    month: String(month).padStart(2, '0'),
  };

  return fetchInstanceClient<ActivityAvailableScheduleItem[]>(
    `/api/proxy/activities/${activityId}/available-schedule`,
    {
      params,
    }
  );
};
