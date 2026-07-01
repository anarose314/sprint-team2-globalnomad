import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  collectPendingReservationIdsForSchedule,
  declinePendingReservationIds,
} from '@/app/(main)/my/activities-dashboard/apis/reservations';
import { isScheduleStartReached } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/utils/scheduleStatus';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';
import type { ReservedScheduleItem } from '@/shared/types/reservedSchedule.types';

/** 자동 거절 후 접두 `[root, activityId]`로 무효화할 쿼리 루트 */
const ACTIVITY_RESERVATION_CACHE_ROOTS = [
  QUERY_KEYS.MY_ACTIVITY_RESERVATIONS[0],
  QUERY_KEYS.MY_ACTIVITY_RESERVED_SCHEDULE[0],
  QUERY_KEYS.MY_ACTIVITY_RESERVATION_DASHBOARD[0],
] as const;

interface UseAutoDeclineExpiredReservationsProps {
  activityId: number | null;
  reservedScheduleDateKey: string | null;
  todayDateKey: string;
  isTodayScheduleFetchRequired: boolean;
  reservedSchedulesSelected: ReservedScheduleItem[];
  reservedSchedulesToday: ReservedScheduleItem[];
}

export const useAutoDeclineExpiredReservations = ({
  activityId,
  reservedScheduleDateKey,
  todayDateKey,
  isTodayScheduleFetchRequired,
  reservedSchedulesSelected,
  reservedSchedulesToday,
}: UseAutoDeclineExpiredReservationsProps) => {
  const queryClient = useQueryClient();
  /** 선택일·체험이 바뀌기 전까지 자동 거절을 이미 시도한 `scheduleId` (무한 invalidate 루프 방지) */
  const autoDeclineAttemptedScheduleIdsRef = useRef<Set<number>>(new Set());

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
      isTodayScheduleFetchRequired &&
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
        if (Math.max(schedule.count.pending, 0) <= 0) continue;
        if (!isScheduleStartReached(dateKey, schedule.startTime, now)) continue;
        if (autoDeclineAttemptedScheduleIdsRef.current.has(schedule.scheduleId))
          continue;
        candidatesByScheduleId.set(schedule.scheduleId, { dateKey, schedule });
      }
    }

    const candidates = [...candidatesByScheduleId.values()];
    if (candidates.length === 0) return;

    let isCancelled = false;

    void (async () => {
      let hasDeclinedAny = false;

      for (const { schedule } of candidates) {
        if (isCancelled) return;

        try {
          const ids = await collectPendingReservationIdsForSchedule({
            activityId,
            scheduleId: schedule.scheduleId,
          });
          if (ids.length === 0) continue;
          if (isCancelled) return;

          // `declinePendingReservationIds`는 일부만 거절돼도 실패분이 있으면 throw하므로 무효화 여부는 거절 시도 직전에 반영
          hasDeclinedAny = true;
          await declinePendingReservationIds(activityId, ids);
        } catch {
          // 다음 스케줄 처리 계속
        } finally {
          autoDeclineAttemptedScheduleIdsRef.current.add(schedule.scheduleId);
        }
      }

      if (isCancelled || !hasDeclinedAny) return;

      await Promise.all(
        ACTIVITY_RESERVATION_CACHE_ROOTS.map((root) =>
          queryClient.invalidateQueries({
            queryKey: [root, activityId],
          })
        )
      );
    })();

    return () => {
      isCancelled = true;
    };
  }, [
    activityId,
    isTodayScheduleFetchRequired,
    queryClient,
    reservedScheduleDateKey,
    reservedSchedulesSelected,
    reservedSchedulesToday,
    todayDateKey,
  ]);
};
