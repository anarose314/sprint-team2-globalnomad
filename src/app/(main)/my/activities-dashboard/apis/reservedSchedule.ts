import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';
import { ReservedScheduleItem } from '@/shared/types/reservedSchedule.types';

interface FetchReservedScheduleProps {
  activityId: number;
  date: string;
}

interface ReservedScheduleResponseLike {
  schedules?: unknown;
  reservedSchedule?: unknown;
  data?: unknown;
}

const extractReservedScheduleList = (response: unknown): unknown[] => {
  if (Array.isArray(response)) {
    return response;
  }

  if (!response || typeof response !== 'object') {
    return [];
  }

  const { schedules, reservedSchedule, data } =
    response as ReservedScheduleResponseLike;

  if (Array.isArray(schedules)) {
    return schedules;
  }

  if (Array.isArray(reservedSchedule)) {
    return reservedSchedule;
  }

  if (Array.isArray(data)) {
    return data;
  }

  return [];
};

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

  const candidateList = extractReservedScheduleList(response);

  return candidateList
    .map((item) => {
      if (!item || typeof item !== 'object') return null;

      const schedule = item as {
        scheduleId?: unknown;
        id?: unknown;
        startTime?: unknown;
        endTime?: unknown;
        count?: {
          declined?: unknown;
          confirmed?: unknown;
          pending?: unknown;
        };
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
        count: {
          declined:
            typeof schedule.count?.declined === 'number'
              ? schedule.count.declined
              : 0,
          confirmed:
            typeof schedule.count?.confirmed === 'number'
              ? schedule.count.confirmed
              : 0,
          pending:
            typeof schedule.count?.pending === 'number'
              ? schedule.count.pending
              : 0,
        },
      } satisfies ReservedScheduleItem;
    })
    .filter((item): item is ReservedScheduleItem => item !== null);
>>>>>>> e124db3 (✨ Feat: 월별 예약 API연동 및 이벤트 뱃지 상태관리)
};
