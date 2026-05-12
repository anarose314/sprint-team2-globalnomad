import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';

interface ActivityScheduleItem {
  date: string;
  startTime: string;
  endTime: string;
}

interface ActivityDetailWithSchedules {
  schedules: ActivityScheduleItem[];
}

interface FetchActivitySchedulesProps {
  activityId: number;
}

/**
 * 체험 상세 스케줄 전체를 조회한다.
 */
export const fetchActivitySchedules = async ({
  activityId,
}: FetchActivitySchedulesProps): Promise<ActivityScheduleItem[]> => {
  const response = await fetchInstanceClient<ActivityDetailWithSchedules>(
    `/api/proxy/activities/${activityId}`
  );

  return response.schedules;
};
