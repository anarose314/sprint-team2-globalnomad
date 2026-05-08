import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';
import { ReservedScheduleItem } from '@/shared/types/reservedSchedule.types';

interface FetchReservedScheduleProps {
  activityId: number;
  date: string;
}

/**
 * 선택한 날짜에 예약 관련 데이터가 있는 스케줄 목록을 조회한다.
 */
export const fetchReservedSchedule = async ({
  activityId,
  date,
<<<<<<< HEAD
}: FetchReservedScheduleProps): Promise<ReservedScheduleItem[]> => {
  return await fetchInstanceClient<ReservedScheduleItem[]>(
    `/api/proxy/my-activities/${activityId}/reserved-schedule`,
=======
}: FetchReservedScheduleProps) => {
  const response = await fetchInstanceClient<unknown>(
    `/api/my-activities/${activityId}/reserved-schedule`,
>>>>>>> e124db3 (✨ Feat: 월별 예약 API연동 및 이벤트 뱃지 상태관리)
    {
      params: { date },
    }
  );
<<<<<<< HEAD
=======

  const candidateList = Array.isArray(response)
    ? response
    : Array.isArray((response as { schedules?: unknown[] })?.schedules)
      ? (response as { schedules: unknown[] }).schedules
      : Array.isArray(
            (response as { reservedSchedule?: unknown[] })?.reservedSchedule
          )
        ? (response as { reservedSchedule: unknown[] }).reservedSchedule
        : Array.isArray((response as { data?: unknown[] })?.data)
          ? (response as { data: unknown[] }).data
          : [];

  return candidateList
    .map((item) => {
      if (!item || typeof item !== 'object') return null;

      const schedule = item as {
        scheduleId?: unknown;
        id?: unknown;
        startTime?: unknown;
        endTime?: unknown;
      };

      const scheduleId =
        typeof schedule.scheduleId === 'number'
          ? schedule.scheduleId
          : typeof schedule.id === 'number'
            ? schedule.id
            : null;

      if (
        scheduleId === null ||
        typeof schedule.startTime !== 'string' ||
        typeof schedule.endTime !== 'string'
      ) {
        return null;
      }

      return {
        scheduleId,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
      } satisfies ReservedScheduleItem;
    })
    .filter((item): item is ReservedScheduleItem => item !== null);
>>>>>>> e124db3 (✨ Feat: 월별 예약 API연동 및 이벤트 뱃지 상태관리)
};
