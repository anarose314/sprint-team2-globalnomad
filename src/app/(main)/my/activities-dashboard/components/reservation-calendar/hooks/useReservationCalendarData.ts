import { useEffect, useMemo, useRef } from 'react';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchReservationDashboard } from '@/app/(main)/my/activities-dashboard/apis/reservationDashboard';
import {
  collectPendingReservationIdsForSchedule,
  declinePendingReservationIds,
} from '@/app/(main)/my/activities-dashboard/apis/reservations';
import { fetchReservedSchedule } from '@/app/(main)/my/activities-dashboard/apis/reservedSchedule';
import {
  ReservationDetailData,
  ReservationEventCounts,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import { buildReservationDetailData } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/utils/mergeReservationDetailData';
import { mergeScheduleOverlayIntoEventCounts } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/utils/mergeScheduleOverlayIntoEventCounts';
import { isScheduleStartReached } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/utils/scheduleStatus';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';
import type { ReservedScheduleItem } from '@/shared/types/reservedSchedule.types';
import { formatDateKey } from '@/shared/utils/formatDate';

interface UseReservationCalendarDataProps {
  activityId: number | null;
  currentYear: number;
  currentMonth: number;
  reservedScheduleDateKey: string | null;
}

/**
 * 예약 캘린더 화면에서 필요한 조회 데이터를 한 번에 조합
 *
 * 선택한 날짜(`reservedScheduleDateKey`)의 스케줄만 조회한 뒤, 체험 시작 시각이 지난 슬롯의 대기(pending) 예약을
 * 클라이언트에서 자동 거절
 * 범위가 선택일로 한정되므로 장기적으로는 서버(Cron·배치·조회 시 정리 등)에서 처리하는 편이 안전함
 *
 * 무효화(invalidate)로 `reservedSchedules`가 다시 불리면 이 effect가 재실행될 수 있음
 * 서버 반영 지연 등으로 pending이 남아 있으면 동일 스케줄에 대한 거절을 반복 호출할 위험이 있어 스케줄 ID별로 한 번만 시도
 */
export const useReservationCalendarData = ({
  activityId,
  currentYear,
  currentMonth,
  reservedScheduleDateKey,
}: UseReservationCalendarDataProps) => {
  const queryClient = useQueryClient();
  /** 선택일·체험이 바뀌기 전까지 자동 거절을 이미 시도한 `scheduleId` (무한 invalidate 루프 방지) */
  const autoDeclineAttemptedScheduleIdsRef = useRef<Set<number>>(new Set());

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

  const monthDateKeysForPrefetch = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      return formatDateKey(new Date(currentYear, currentMonth - 1, day));
    }).filter(
      (dateKey) =>
        reservedScheduleDateKey === null || dateKey !== reservedScheduleDateKey
    );
  }, [currentYear, currentMonth, reservedScheduleDateKey]);

  const reservedSchedulesPerDayQueries = useQueries({
    queries:
      activityId === null
        ? []
        : monthDateKeysForPrefetch.map((dateKey) => ({
            queryKey: [
              ...QUERY_KEYS.MY_ACTIVITY_RESERVED_SCHEDULE,
              activityId,
              dateKey,
            ],
            queryFn: () =>
              fetchReservedSchedule({
                activityId,
                date: dateKey,
              }),
            staleTime: 60_000,
          })),
  });

  useEffect(() => {
    autoDeclineAttemptedScheduleIdsRef.current.clear();
  }, [activityId, reservedScheduleDateKey]);

  useEffect(() => {
    if (activityId === null || reservedScheduleDateKey === null) return;
    if (reservedSchedules.length === 0) return;

    const now = new Date();
    const startPassedWithPending = reservedSchedules.filter(
      (schedule) =>
        Math.max(schedule.count.pending, 0) > 0 &&
        isScheduleStartReached(reservedScheduleDateKey, schedule.startTime, now)
    );

    const candidates = startPassedWithPending.filter(
      (schedule) =>
        !autoDeclineAttemptedScheduleIdsRef.current.has(schedule.scheduleId)
    );

    if (candidates.length === 0) return;

    let cancelled = false;

    void (async () => {
      let declinedAny = false;

      for (const schedule of candidates) {
        if (cancelled) return;

        try {
          const ids = await collectPendingReservationIdsForSchedule({
            activityId,
            scheduleId: schedule.scheduleId,
          });
          if (ids.length === 0) continue;
          if (cancelled) return;

          await declinePendingReservationIds(activityId, ids);
          declinedAny = true;
        } catch {
          // 다음 스케줄 처리 계속
        } finally {
          autoDeclineAttemptedScheduleIdsRef.current.add(schedule.scheduleId);
        }
      }

      if (cancelled || !declinedAny) return;

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [...QUERY_KEYS.MY_ACTIVITY_RESERVATIONS, activityId],
        }),
        queryClient.invalidateQueries({
          queryKey: [...QUERY_KEYS.MY_ACTIVITY_RESERVED_SCHEDULE, activityId],
        }),
        queryClient.invalidateQueries({
          queryKey: [
            ...QUERY_KEYS.MY_ACTIVITY_RESERVATION_DASHBOARD,
            activityId,
          ],
        }),
      ]);
    })();

    return () => {
      cancelled = true;
    };
  }, [activityId, queryClient, reservedScheduleDateKey, reservedSchedules]);

  const { eventCountsByDate, notificationDotByDate } = useMemo(() => {
    const todayDateKey = formatDateKey(new Date());
    const notificationDotByDate: Record<string, boolean> = {};

    const eventCounts = reservationDashboard.reduce<
      Record<string, ReservationEventCounts>
    >((accumulator, item) => {
      const r = item.reservations;
      const completed = Math.max(r.completed ?? 0, 0);
      const confirmed = Math.max(r.confirmed ?? 0, 0);
      const pending = Math.max(r.pending ?? 0, 0);
      const declined = Math.max(r.declined ?? 0, 0);
      const rawTotal = pending + confirmed + completed + declined;
      if (rawTotal > 0) {
        notificationDotByDate[item.date] = true;
      }

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

    const scheduleDataByDate = new Map<string, ReservedScheduleItem[]>();

    monthDateKeysForPrefetch.forEach((dateKey, index) => {
      scheduleDataByDate.set(
        dateKey,
        reservedSchedulesPerDayQueries[index]?.data ?? []
      );
    });

    if (reservedScheduleDateKey) {
      scheduleDataByDate.set(reservedScheduleDateKey, reservedSchedules);
    }

    const nowForSchedules = new Date();
    scheduleDataByDate.forEach((schedules, dateKey) => {
      const hasSlotActivity = schedules.some((schedule) => {
        const pending = Math.max(schedule.count.pending ?? 0, 0);
        const confirmed = Math.max(schedule.count.confirmed ?? 0, 0);
        const declined = Math.max(schedule.count.declined ?? 0, 0);
        return pending + confirmed + declined > 0;
      });
      if (hasSlotActivity) {
        notificationDotByDate[dateKey] = true;
      }

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
    reservationDashboard,
    reservedScheduleDateKey,
    reservedSchedules,
    monthDateKeysForPrefetch,
    reservedSchedulesPerDayQueries,
  ]);

  const detailData = useMemo<ReservationDetailData>(() => {
    return buildReservationDetailData({
      reservedSchedules,
    });
  }, [reservedSchedules]);

  return {
    detailData,
    eventCountsByDate,
    notificationDotByDate,
  };
};
