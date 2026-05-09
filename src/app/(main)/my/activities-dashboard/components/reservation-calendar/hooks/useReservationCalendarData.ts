import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchActivitySchedules } from '@/app/(main)/my/activities-dashboard/apis/activitySchedules';
import { fetchReservationDashboard } from '@/app/(main)/my/activities-dashboard/apis/reservationDashboard';
import { fetchReservedSchedule } from '@/app/(main)/my/activities-dashboard/apis/reservedSchedule';
import {
  ReservationDetailData,
  ReservationEventCounts,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';

interface UseReservationCalendarDataParams {
  activityId: number | null;
  currentYear: number;
  currentMonth: number;
  reservedScheduleDateKey: string | null;
}

const EMPTY_RESERVATION_COUNT = {
  pending: 0,
  confirmed: 0,
  declined: 0,
};

/**
 * 예약 캘린더 화면에서 필요한 조회 데이터를 한 번에 조합
 *
 * @param params - 조회 조건(체험, 현재 연월, 선택 날짜 키)
 * @returns 날짜별 이벤트 카운트와 상세 패널용 시간 슬롯 데이터
 */
export const useReservationCalendarData = ({
  activityId,
  currentYear,
  currentMonth,
  reservedScheduleDateKey,
}: UseReservationCalendarDataParams) => {
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
    const filteredActivitySchedules = reservedScheduleDateKey
      ? activitySchedules.filter(
          (schedule) => schedule.date === reservedScheduleDateKey
        )
      : [];
    const reservedByScheduleId = new Map(
      reservedSchedules.map(
        (schedule) => [schedule.scheduleId, schedule] as const
      )
    );
    const consumedReservedScheduleIds = new Set<number>();

    const mergedTimeSlots = filteredActivitySchedules
      .map((schedule) => {
        const reservedSchedule =
          schedule.scheduleId !== null
            ? reservedByScheduleId.get(schedule.scheduleId)
            : undefined;

        if (reservedSchedule) {
          consumedReservedScheduleIds.add(reservedSchedule.scheduleId);
        }

        const resolvedScheduleId =
          schedule.scheduleId ?? reservedSchedule?.scheduleId ?? null;

        return {
          scheduleId: resolvedScheduleId,
          label: `${schedule.startTime} - ${schedule.endTime}`,
          value:
            resolvedScheduleId !== null
              ? String(resolvedScheduleId)
              : `${schedule.startTime}-${schedule.endTime}`,
          count: reservedSchedule?.count ?? EMPTY_RESERVATION_COUNT,
          sortKey: schedule.startTime,
        };
      })
      .concat(
        reservedSchedules
          .filter(
            (schedule) => !consumedReservedScheduleIds.has(schedule.scheduleId)
          )
          .map((schedule) => ({
            scheduleId: schedule.scheduleId,
            label: `${schedule.startTime} - ${schedule.endTime}`,
            value: String(schedule.scheduleId),
            count: schedule.count,
            sortKey: schedule.startTime,
          }))
      )
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .map(({ sortKey: _sortKey, ...timeSlot }) => timeSlot);

    return {
      timeSlots: mergedTimeSlots,
    };
  }, [activitySchedules, reservedScheduleDateKey, reservedSchedules]);

  return {
    detailData,
    eventCountsByDate,
  };
};
