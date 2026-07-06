import { useMemo } from 'react';
import {
  ReservationDetailData,
  ReservationEventCounts,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import { buildReservationDetailData } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/utils/mergeReservationDetailData';
import { mergeScheduleOverlayIntoEventCounts } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/utils/mergeScheduleOverlayIntoEventCounts';
import type { ReservationDashboardDailyItem } from '@/shared/types/reservationDashboard.types';
import type { ReservedScheduleItem } from '@/shared/types/reservedSchedule.types';

const hasReservedSlotActivity = (schedules: ReservedScheduleItem[]) =>
  schedules.some((schedule) => {
    const pending = Math.max(schedule.count.pending, 0);
    const confirmed = Math.max(schedule.count.confirmed, 0);
    const declined = Math.max(schedule.count.declined, 0);
    return pending + confirmed + declined > 0;
  });

interface UseReservationCalendarDisplayDataProps {
  reservationDashboard: ReservationDashboardDailyItem[];
  reservedScheduleDateKey: string | null;
  reservedSchedulesSelected: ReservedScheduleItem[];
  reservedSchedulesToday: ReservedScheduleItem[];
  isTodayScheduleFetchRequired: boolean;
  todayDateKey: string;
}

export const useReservationCalendarDisplayData = ({
  reservationDashboard,
  reservedScheduleDateKey,
  reservedSchedulesSelected,
  reservedSchedulesToday,
  isTodayScheduleFetchRequired,
  todayDateKey,
}: UseReservationCalendarDisplayDataProps) => {
  const { eventCountsByDate, notificationDotByDate } = useMemo(() => {
    const notificationDotByDate: Record<string, boolean> = {};

    const eventCounts = reservationDashboard.reduce<
      Record<string, ReservationEventCounts>
    >((accumulator, item) => {
      const r = item.reservations;
      const completed = Math.max(r.completed ?? 0, 0);
      const confirmed = Math.max(r.confirmed ?? 0, 0);
      const pending = Math.max(r.pending ?? 0, 0);
      const declined = Math.max(r.declined ?? 0, 0);
      const isPastDate = item.date < todayDateKey;
      const pendingForDisplay = isPastDate ? 0 : pending;
      const rawTotal = pendingForDisplay + confirmed + completed + declined;
      if (rawTotal > 0) {
        notificationDotByDate[item.date] = true;
      }

      const shiftedCompleted = isPastDate ? completed + confirmed : completed;
      const shiftedConfirmed = isPastDate ? 0 : confirmed;

      const dailyEventCounts: ReservationEventCounts = {};
      if (pendingForDisplay > 0) dailyEventCounts.pending = pendingForDisplay;
      if (shiftedConfirmed > 0) dailyEventCounts.confirmed = shiftedConfirmed;
      if (shiftedCompleted > 0) dailyEventCounts.completed = shiftedCompleted;

      if (Object.keys(dailyEventCounts).length > 0) {
        accumulator[item.date] = dailyEventCounts;
      }

      return accumulator;
    }, {});

    if (
      reservedScheduleDateKey &&
      hasReservedSlotActivity(reservedSchedulesSelected)
    ) {
      notificationDotByDate[reservedScheduleDateKey] = true;
    }

    if (
      isTodayScheduleFetchRequired &&
      hasReservedSlotActivity(reservedSchedulesToday)
    ) {
      notificationDotByDate[todayDateKey] = true;
    }

    const scheduleDataByDate = new Map<string, ReservedScheduleItem[]>();
    if (reservedScheduleDateKey && reservedSchedulesSelected.length > 0) {
      scheduleDataByDate.set(
        reservedScheduleDateKey,
        reservedSchedulesSelected
      );
    }
    if (
      isTodayScheduleFetchRequired &&
      reservedSchedulesToday.length > 0 &&
      todayDateKey !== reservedScheduleDateKey
    ) {
      scheduleDataByDate.set(todayDateKey, reservedSchedulesToday);
    }

    const nowForSchedules = new Date();
    scheduleDataByDate.forEach((schedules, dateKey) => {
      const merged = mergeScheduleOverlayIntoEventCounts(
        dateKey,
        schedules,
        nowForSchedules,
        eventCounts[dateKey]
      );
      if (merged) {
        eventCounts[dateKey] = merged;
      }
    });

    return { eventCountsByDate: eventCounts, notificationDotByDate };
  }, [
    isTodayScheduleFetchRequired,
    reservationDashboard,
    reservedScheduleDateKey,
    reservedSchedulesSelected,
    reservedSchedulesToday,
    todayDateKey,
  ]);

  const detailData = useMemo<ReservationDetailData>(() => {
    return buildReservationDetailData({
      reservedSchedules: reservedSchedulesSelected,
    });
  }, [reservedSchedulesSelected]);

  return { eventCountsByDate, notificationDotByDate, detailData };
};
