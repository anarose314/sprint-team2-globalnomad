import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchActivitySchedules } from '@/app/(main)/my/activities-dashboard/apis/activitySchedules';
import { fetchReservationDashboard } from '@/app/(main)/my/activities-dashboard/apis/reservationDashboard';
import { fetchReservedSchedule } from '@/app/(main)/my/activities-dashboard/apis/reservedSchedule';
import {
  ReservationDetailData,
  ReservationEventCounts,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import { buildReservationDetailData } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/utils/mergeReservationDetailData';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';

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

  const { data: activitySchedules = [] } = useQuery({
    queryKey: [...QUERY_KEYS.MY_ACTIVITY_DATE_SCHEDULES, activityId],
    queryFn: () =>
      fetchActivitySchedules({
        activityId: activityId as number,
      }),
    enabled: activityId !== null,
  });

  const eventCountsByDate = useMemo<
    Record<string, ReservationEventCounts>
  >(() => {
    const eventCounts = reservationDashboard.reduce<
      Record<string, ReservationEventCounts>
    >((accumulator, item) => {
      const completed = Math.max(item.reservations.completed, 0);
      const confirmed = Math.max(item.reservations.confirmed, 0);
      const declined = Math.max(item.reservations.declined, 0);
      const pending = Math.max(item.reservations.pending, 0);

      const dailyEventCounts: ReservationEventCounts = {};
      if (pending > 0) dailyEventCounts.pending = pending;
      if (confirmed > 0) dailyEventCounts.confirmed = confirmed;
      if (declined > 0) dailyEventCounts.declined = declined;
      if (completed > 0) dailyEventCounts.completed = completed;

      if (Object.keys(dailyEventCounts).length > 0) {
        accumulator[item.date] = dailyEventCounts;
      }

      return accumulator;
    }, {});

    // 현재 선택 날짜는 reserved-schedule 집계값으로 보정한다.
    if (reservedScheduleDateKey) {
      const normalized = reservedSchedules.reduce(
        (accumulator, schedule) => {
          accumulator.pending += Math.max(schedule.count.pending, 0);
          accumulator.confirmed += Math.max(schedule.count.confirmed, 0);
          accumulator.declined += Math.max(schedule.count.declined, 0);
          return accumulator;
        },
        { pending: 0, confirmed: 0, declined: 0 }
      );

      const completed = Math.max(
        eventCounts[reservedScheduleDateKey]?.completed ?? 0,
        0
      );

      const mergedDailyCounts: ReservationEventCounts = {};
      if (normalized.pending > 0)
        mergedDailyCounts.pending = normalized.pending;
      if (normalized.confirmed > 0)
        mergedDailyCounts.confirmed = normalized.confirmed;
      if (normalized.declined > 0)
        mergedDailyCounts.declined = normalized.declined;
      if (completed > 0) mergedDailyCounts.completed = completed;

      if (Object.keys(mergedDailyCounts).length > 0) {
        eventCounts[reservedScheduleDateKey] = mergedDailyCounts;
      }
    }

    return eventCounts;
  }, [reservationDashboard, reservedScheduleDateKey, reservedSchedules]);

  const detailData = useMemo<ReservationDetailData>(() => {
    return buildReservationDetailData({
      activitySchedules,
      reservedSchedules,
      reservedScheduleDateKey,
    });
  }, [activitySchedules, reservedScheduleDateKey, reservedSchedules]);

  return {
    detailData,
    eventCountsByDate,
  };
};
