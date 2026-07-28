import { useMemo } from 'react';
import { ReservationDetailData } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import { buildReservationCalendarDisplayData } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/utils/buildReservationCalendarDisplayData';
import { buildReservationDetailData } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/utils/mergeReservationDetailData';
import type { ReservationDashboardDailyItem } from '@/shared/types/reservationDashboard.types';
import type { ReservedScheduleItem } from '@/shared/types/reservedSchedule.types';

interface UseReservationCalendarDisplayDataProps {
  reservationDashboard: ReservationDashboardDailyItem[];
  reservedScheduleDateKey: string | null;
  reservedSchedulesSelected: ReservedScheduleItem[];
  reservedSchedulesToday: ReservedScheduleItem[];
  isTodayScheduleFetchRequired: boolean;
  todayDateKey: string;
}

/**
 * 계산 규칙은 순수 함수(`buildReservationCalendarDisplayData`, `buildReservationDetailData`)에 두고,
 * 이 훅은 입력 데이터를 전달하고 계산 결과를 반환하는 역할만 담당한다.
 */
export const useReservationCalendarDisplayData = ({
  reservationDashboard,
  reservedScheduleDateKey,
  reservedSchedulesSelected,
  reservedSchedulesToday,
  isTodayScheduleFetchRequired,
  todayDateKey,
}: UseReservationCalendarDisplayDataProps) => {
  const { eventCountsByDate, notificationDotByDate } = useMemo(
    () =>
      buildReservationCalendarDisplayData({
        reservationDashboard,
        reservedScheduleDateKey,
        reservedSchedulesSelected,
        reservedSchedulesToday,
        isTodayScheduleFetchRequired,
        todayDateKey,
        now: new Date(),
      }),
    [
      isTodayScheduleFetchRequired,
      reservationDashboard,
      reservedScheduleDateKey,
      reservedSchedulesSelected,
      reservedSchedulesToday,
      todayDateKey,
    ]
  );

  const detailData = useMemo<ReservationDetailData>(
    () =>
      buildReservationDetailData({
        reservedSchedules: reservedSchedulesSelected,
      }),
    [reservedSchedulesSelected]
  );

  return { eventCountsByDate, notificationDotByDate, detailData };
};
