import { useEffect, useMemo, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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

/** 자동 거절 후 접두 `[root, activityId]`로 무효화할 쿼리 루트 */
const ACTIVITY_RESERVATION_CACHE_ROOTS = [
  QUERY_KEYS.MY_ACTIVITY_RESERVATIONS[0],
  QUERY_KEYS.MY_ACTIVITY_RESERVED_SCHEDULE[0],
  QUERY_KEYS.MY_ACTIVITY_RESERVATION_DASHBOARD[0],
] as const;

const hasReservedSlotActivity = (schedules: ReservedScheduleItem[]) =>
  schedules.some((schedule) => {
    const pending = Math.max(schedule.count.pending ?? 0, 0);
    const confirmed = Math.max(schedule.count.confirmed ?? 0, 0);
    const declined = Math.max(schedule.count.declined ?? 0, 0);
    return pending + confirmed + declined > 0;
  });

interface UseReservationCalendarDataProps {
  activityId: number | null;
  currentYear: number;
  currentMonth: number;
  reservedScheduleDateKey: string | null;
}

/**
 * 예약 캘린더 화면에서 필요한 조회 데이터를 한 번에 조합
 *
 * 월간 `reservation-dashboard`로 달력 배지·알림 도트를 구성하고, URL로 연 선택일·그리고
 * 현재 보이는 달에 포함된 오늘 날짜에 대해 `reserved-schedule`을 조회해 배지 집계를 스케줄 단위로 보정
 * (오늘만 선택하지 않아도 지난 슬롯의 pending이 대시보드에 남는 문제를 막기 위함)
 * 대시보드에 없는 날을 URL로만 열었을 때의 도트는 선택일 스케줄 응답으로만 보강
 *
 * 선택한 날짜의 스케줄을 조회한 뒤 체험 시작 시각이 지난 슬롯의 대기(pending) 예약을 클라이언트에서 자동 거절
 * 범위가 선택일로 한정되므로 장기적으로는 서버(Cron·배치·조회 시 정리 등)에서 처리하는 편이 안전
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

  const todayDateKey = formatDateKey(new Date());
  const isTodayInVisibleMonth = useMemo(() => {
    const now = new Date();
    return (
      now.getFullYear() === currentYear && now.getMonth() + 1 === currentMonth
    );
  }, [currentYear, currentMonth]);

  const fetchTodayScheduleInBackground =
    isTodayInVisibleMonth &&
    (reservedScheduleDateKey === null ||
      reservedScheduleDateKey !== todayDateKey);

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

  const { data: reservedSchedulesSelected = [] } = useQuery({
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

  const { data: reservedSchedulesToday = [] } = useQuery({
    queryKey: [
      ...QUERY_KEYS.MY_ACTIVITY_RESERVED_SCHEDULE,
      activityId,
      todayDateKey,
    ],
    queryFn: () =>
      fetchReservedSchedule({
        activityId: activityId as number,
        date: todayDateKey,
      }),
    enabled: activityId !== null && fetchTodayScheduleInBackground,
    refetchInterval:
      activityId !== null && fetchTodayScheduleInBackground ? 60_000 : false,
  });

  useEffect(() => {
    autoDeclineAttemptedScheduleIdsRef.current.clear();
  }, [activityId, reservedScheduleDateKey, todayDateKey]);

  useEffect(() => {
    if (activityId === null) return;

    const scheduleLoads: {
      dateKey: string;
      schedules: ReservedScheduleItem[];
    }[] = [];

    if (reservedScheduleDateKey && reservedSchedulesSelected.length > 0) {
      scheduleLoads.push({
        dateKey: reservedScheduleDateKey,
        schedules: reservedSchedulesSelected,
      });
    }

    if (
      fetchTodayScheduleInBackground &&
      reservedSchedulesToday.length > 0 &&
      !scheduleLoads.some((entry) => entry.dateKey === todayDateKey)
    ) {
      scheduleLoads.push({
        dateKey: todayDateKey,
        schedules: reservedSchedulesToday,
      });
    }

    if (scheduleLoads.length === 0) return;

    const now = new Date();
    const candidatesByScheduleId = new Map<
      number,
      { dateKey: string; schedule: ReservedScheduleItem }
    >();

    for (const { dateKey, schedules } of scheduleLoads) {
      for (const schedule of schedules) {
        if (Math.max(schedule.count.pending ?? 0, 0) <= 0) continue;
        if (!isScheduleStartReached(dateKey, schedule.startTime, now)) continue;
        if (autoDeclineAttemptedScheduleIdsRef.current.has(schedule.scheduleId))
          continue;
        candidatesByScheduleId.set(schedule.scheduleId, { dateKey, schedule });
      }
    }

    const candidates = [...candidatesByScheduleId.values()];
    if (candidates.length === 0) return;

    let cancelled = false;

    void (async () => {
      let declinedAny = false;

      for (const { schedule } of candidates) {
        if (cancelled) return;

        try {
          const ids = await collectPendingReservationIdsForSchedule({
            activityId,
            scheduleId: schedule.scheduleId,
          });
          if (ids.length === 0) continue;
          if (cancelled) return;

          // `declinePendingReservationIds`는 일부만 거절돼도 실패분이 있으면 throw하므로 무효화 여부는 거절 시도 직전에 반영
          declinedAny = true;
          await declinePendingReservationIds(activityId, ids);
        } catch {
          // 다음 스케줄 처리 계속
        } finally {
          autoDeclineAttemptedScheduleIdsRef.current.add(schedule.scheduleId);
        }
      }

      if (cancelled || !declinedAny) return;

      await Promise.all(
        ACTIVITY_RESERVATION_CACHE_ROOTS.map((root) =>
          queryClient.invalidateQueries({
            queryKey: [root, activityId],
          })
        )
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [
    activityId,
    fetchTodayScheduleInBackground,
    queryClient,
    reservedScheduleDateKey,
    reservedSchedulesSelected,
    reservedSchedulesToday,
    todayDateKey,
  ]);

  const { eventCountsByDate, notificationDotByDate } = useMemo(() => {
    const todayKey = formatDateKey(new Date());
    const notificationDotByDate: Record<string, boolean> = {};

    const eventCounts = reservationDashboard.reduce<
      Record<string, ReservationEventCounts>
    >((accumulator, item) => {
      const r = item.reservations;
      const completed = Math.max(r.completed ?? 0, 0);
      const confirmed = Math.max(r.confirmed ?? 0, 0);
      const pending = Math.max(r.pending ?? 0, 0);
      const declined = Math.max(r.declined ?? 0, 0);
      const isPastDate = item.date < todayKey;
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
      fetchTodayScheduleInBackground &&
      hasReservedSlotActivity(reservedSchedulesToday)
    ) {
      notificationDotByDate[todayKey] = true;
    }

    const scheduleDataByDate = new Map<string, ReservedScheduleItem[]>();
    if (reservedScheduleDateKey && reservedSchedulesSelected.length > 0) {
      scheduleDataByDate.set(
        reservedScheduleDateKey,
        reservedSchedulesSelected
      );
    }
    if (
      fetchTodayScheduleInBackground &&
      reservedSchedulesToday.length > 0 &&
      todayKey !== reservedScheduleDateKey
    ) {
      scheduleDataByDate.set(todayKey, reservedSchedulesToday);
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
    fetchTodayScheduleInBackground,
    reservationDashboard,
    reservedScheduleDateKey,
    reservedSchedulesSelected,
    reservedSchedulesToday,
  ]);

  const detailData = useMemo<ReservationDetailData>(() => {
    return buildReservationDetailData({
      reservedSchedules: reservedSchedulesSelected,
    });
  }, [reservedSchedulesSelected]);

  return {
    detailData,
    eventCountsByDate,
    notificationDotByDate,
  };
};
