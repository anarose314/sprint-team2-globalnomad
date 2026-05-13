import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';

export interface ActivityScheduleItem {
  scheduleId: number | null;
  date: string;
  startTime: string;
  endTime: string;
}

interface ActivityDetailWithSchedules {
  schedules: Array<{
    id?: number;
    date: string;
    startTime: string;
    endTime: string;
  }>;
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

  return response.schedules.map((schedule) => ({
    scheduleId: schedule.id ?? null,
    date: schedule.date,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
  }));
};
