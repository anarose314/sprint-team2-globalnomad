import { useQuery } from '@tanstack/react-query';
import { fetchReservationDashboard } from '@/app/(main)/my/activities-dashboard/apis/reservationDashboard';
import { fetchReservedSchedule } from '@/app/(main)/my/activities-dashboard/apis/reservedSchedule';
import { reservationKeys } from '@/shared/queryKeys/reservationKeys';
import type { ReservationDashboardDailyItem } from '@/shared/types/reservationDashboard.types';
import type { ReservedScheduleItem } from '@/shared/types/reservedSchedule.types';

const EMPTY_SCHEDULES: ReservedScheduleItem[] = [];
const EMPTY_DASHBOARD: ReservationDashboardDailyItem[] = [];

interface UseReservationCalendarQueriesProps {
  activityId: number | null;
  currentYear: number;
  currentMonth: number;
  reservedScheduleDateKey: string | null;
  todayDateKey: string;
  isTodayScheduleFetchRequired: boolean;
}

export const useReservationCalendarQueries = ({
  activityId,
  currentYear,
  currentMonth,
  reservedScheduleDateKey,
  todayDateKey,
  isTodayScheduleFetchRequired,
}: UseReservationCalendarQueriesProps) => {
  const { data: reservationDashboard = EMPTY_DASHBOARD } = useQuery({
    queryKey: reservationKeys.dashboard.byMonth(
      activityId,
      currentYear,
      currentMonth
    ),
    queryFn: () =>
      fetchReservationDashboard({
        activityId: activityId as number,
        year: currentYear,
        month: currentMonth,
      }),
    enabled: activityId !== null,
    refetchInterval: activityId !== null ? 60_000 : false,
  });

  const { data: reservedSchedulesSelected = EMPTY_SCHEDULES } = useQuery({
    queryKey: reservationKeys.reservedSchedule.byDate(
      activityId,
      reservedScheduleDateKey
    ),
    queryFn: () =>
      fetchReservedSchedule({
        activityId: activityId as number,
        date: reservedScheduleDateKey as string,
      }),
    enabled: activityId !== null && Boolean(reservedScheduleDateKey),
    refetchInterval:
      activityId !== null && Boolean(reservedScheduleDateKey) ? 60_000 : false,
  });

  const { data: reservedSchedulesToday = EMPTY_SCHEDULES } = useQuery({
    queryKey: reservationKeys.reservedSchedule.byDate(activityId, todayDateKey),
    queryFn: () =>
      fetchReservedSchedule({
        activityId: activityId as number,
        date: todayDateKey,
      }),
    enabled: activityId !== null && isTodayScheduleFetchRequired,
    refetchInterval:
      activityId !== null && isTodayScheduleFetchRequired ? 60_000 : false,
  });

  return {
    reservationDashboard,
    reservedSchedulesSelected,
    reservedSchedulesToday,
  };
};
