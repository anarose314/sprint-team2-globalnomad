import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';
import { ReservationDashboardDailyItem } from '@/shared/types/reservationDashboard.types';

interface FetchReservationDashboardProps {
  activityId: number;
  year: number;
  month: number;
}

/**
 * 선택한 내 체험의 월별 예약 현황 조회
 */
export const fetchReservationDashboard = async ({
  activityId,
  year,
  month,
}: FetchReservationDashboardProps): Promise<
  ReservationDashboardDailyItem[]
> => {
  const params = {
    year,
    month: String(month).padStart(2, '0'),
  };

  return await fetchInstanceClient<ReservationDashboardDailyItem[]>(
    `/api/proxy/my-activities/${activityId}/reservation-dashboard`,
    { params }
  );
};
