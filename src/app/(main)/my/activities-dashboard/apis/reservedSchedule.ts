import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';
import { ReservedScheduleItem } from '@/shared/types/reservedSchedule.types';

interface FetchReservedScheduleProps {
  activityId: number;
  date: string;
}

/**
 * 선택한 날짜에 예약 관련 데이터가 있는 스케줄 목록 조회
 */
export const fetchReservedSchedule = async ({
  activityId,
  date,
}: FetchReservedScheduleProps): Promise<ReservedScheduleItem[]> => {
  return await fetchInstanceClient<ReservedScheduleItem[]>(
    `/api/proxy/my-activities/${activityId}/reserved-schedule`,
    {
      params: { date },
    }
  );
};
