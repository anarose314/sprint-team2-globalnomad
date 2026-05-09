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
    return reservationDashboard.reduce<Record<string, ReservationEventCounts>>(
      (accumulator, item) => {
        const completed = Math.max(item.reservations.completed, 0);
        const confirmed = Math.max(item.reservations.confirmed, 0);
        const pending = Math.max(item.reservations.pending, 0);

        const eventCounts: ReservationEventCounts = {};
        if (pending > 0) eventCounts.pending = pending;
        if (confirmed > 0) eventCounts.confirmed = confirmed;
        if (completed > 0) eventCounts.completed = completed;

        if (Object.keys(eventCounts).length > 0) {
          accumulator[item.date] = eventCounts;
        }

        return accumulator;
      },
      {}
    );
  }, [reservationDashboard]);

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
