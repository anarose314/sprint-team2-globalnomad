import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchReservationDashboard } from '@/app/(main)/my/activities-dashboard/apis/reservationDashboard';
import { fetchReservedSchedule } from '@/app/(main)/my/activities-dashboard/apis/reservedSchedule';
import {
  ReservationDetailData,
  ReservationEventCounts,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import { buildReservationDetailData } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/utils/mergeReservationDetailData';
import { isScheduleEnded } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/utils/scheduleStatus';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';
import { formatDateKey } from '@/shared/utils/formatDate';

interface UseReservationCalendarDataProps {
  activityId: number | null;
  currentYear: number;
  currentMonth: number;
  reservedScheduleDateKey: string | null;
}

/**
 * 예약 캘린더 화면에서 필요한 조회 데이터를 한 번에 조합
 */
export const useReservationCalendarData = ({
  activityId,
  currentYear,
  currentMonth,
  reservedScheduleDateKey,
}: UseReservationCalendarDataProps) => {
  const { data: reservationDashboard = [] } = useQuery({
    queryKey: [
      ...QUERY_KEYS.MY_ACTIVITY_RESERVATION_DASHBOARD,
      activityId,
      currentYear,
      currentMonth,
    ],
    queryFn: () =>
      fetchReservationDashboard({
        activityId: activityId as number,
        year: currentYear,
        month: currentMonth,
      }),
    enabled: activityId !== null,
    refetchInterval: activityId !== null ? 60_000 : false,
  });

  const { data: reservedSchedules = [] } = useQuery({
    queryKey: [
      ...QUERY_KEYS.MY_ACTIVITY_RESERVED_SCHEDULE,
      activityId,
      reservedScheduleDateKey,
    ],
    queryFn: () =>
      fetchReservedSchedule({
        activityId: activityId as number,
        date: reservedScheduleDateKey as string,
      }),
    enabled: activityId !== null && Boolean(reservedScheduleDateKey),
    refetchInterval:
      activityId !== null && Boolean(reservedScheduleDateKey) ? 60_000 : false,
  });

  const eventCountsByDate = useMemo<
    Record<string, ReservationEventCounts>
  >(() => {
    const todayDateKey = formatDateKey(new Date());
    const eventCounts = reservationDashboard.reduce<
      Record<string, ReservationEventCounts>
    >((accumulator, item) => {
      const completed = Math.max(item.reservations.completed, 0);
      const confirmed = Math.max(item.reservations.confirmed, 0);
      const pending = Math.max(item.reservations.pending, 0);
      const isPastDate = item.date < todayDateKey;
      const shiftedCompleted = isPastDate ? completed + confirmed : completed;
      const shiftedConfirmed = isPastDate ? 0 : confirmed;

      const dailyEventCounts: ReservationEventCounts = {};
      if (pending > 0) dailyEventCounts.pending = pending;
      if (shiftedConfirmed > 0) dailyEventCounts.confirmed = shiftedConfirmed;
      if (shiftedCompleted > 0) dailyEventCounts.completed = shiftedCompleted;

      if (Object.keys(dailyEventCounts).length > 0) {
        accumulator[item.date] = dailyEventCounts;
      }

      return accumulator;
    }, {});

    // 현재 선택 날짜는 reserved-schedule 집계값으로 보정한다.
    if (reservedScheduleDateKey) {
      const now = new Date();
      const normalized = reservedSchedules.reduce(
        (accumulator, schedule) => {
          accumulator.pending += Math.max(schedule.count.pending, 0);
          const confirmedCount = Math.max(schedule.count.confirmed, 0);
          if (confirmedCount > 0) {
            if (
              isScheduleEnded(reservedScheduleDateKey, schedule.endTime, now)
            ) {
              accumulator.completed += confirmedCount;
            } else {
              accumulator.confirmed += confirmedCount;
            }
          }
          return accumulator;
        },
        { pending: 0, confirmed: 0, completed: 0 }
      );

      const completed = Math.max(
        eventCounts[reservedScheduleDateKey]?.completed ?? 0,
        0
      );
      const mergedCompleted = Math.max(completed, normalized.completed);

      const mergedDailyCounts: ReservationEventCounts = {};
      if (normalized.pending > 0)
        mergedDailyCounts.pending = normalized.pending;
      if (normalized.confirmed > 0)
        mergedDailyCounts.confirmed = normalized.confirmed;
      if (mergedCompleted > 0) mergedDailyCounts.completed = mergedCompleted;

      if (Object.keys(mergedDailyCounts).length > 0) {
        eventCounts[reservedScheduleDateKey] = mergedDailyCounts;
      }
    }

    return eventCounts;
  }, [reservationDashboard, reservedScheduleDateKey, reservedSchedules]);

  const detailData = useMemo<ReservationDetailData>(() => {
    return buildReservationDetailData({
      reservedSchedules,
    });
  }, [reservedSchedules]);

  return {
    detailData,
    eventCountsByDate,
  };
};
