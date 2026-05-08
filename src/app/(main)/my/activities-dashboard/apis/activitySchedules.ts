import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';

interface ActivityScheduleItem {
  date: string;
  startTime: string;
  endTime: string;
}

interface ActivityDetailWithSchedules {
  schedules?: unknown[];
}

interface FetchActivitySchedulesByDateProps {
  activityId: number;
  date: string;
}

/**
 * 체험 상세 스케줄 중 선택 날짜에 해당하는 시간대를 조회한다.
 */
export const fetchActivitySchedulesByDate = async ({
  activityId,
  date,
}: FetchActivitySchedulesByDateProps) => {
  const response = await fetchInstanceClient<ActivityDetailWithSchedules>(
    `/api/activities/${activityId}`
  );

  const schedules = Array.isArray(response?.schedules)
    ? response.schedules
    : [];

  return schedules
    .map((item) => {
      if (!item || typeof item !== 'object') return null;

      const schedule = item as {
        date?: unknown;
        startTime?: unknown;
        endTime?: unknown;
      };

      if (
        typeof schedule.date !== 'string' ||
        typeof schedule.startTime !== 'string' ||
        typeof schedule.endTime !== 'string'
      ) {
        return null;
      }

      return {
        date: schedule.date,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
      } satisfies ActivityScheduleItem;
    })
    .filter(
      (item): item is ActivityScheduleItem =>
        item !== null && item.date === date
    );
};
