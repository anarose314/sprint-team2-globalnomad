import type { ReservationEventCounts } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import { isScheduleEnded } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/utils/scheduleStatus';
import type { ReservedScheduleItem } from '@/shared/types/reservedSchedule.types';

/**
 * reserved-schedule 응답을 해당 날짜의 달력 배지 집계에 반영한다.
 * (대시보드 API에 일부 카운트가 누락된 경우에도 스케줄 단위 집계로 보정한다. 달력에는 거절 수를 표시하지 않는다.)
 */
export const mergeScheduleOverlayIntoEventCounts = (
  dateKey: string,
  schedules: ReservedScheduleItem[],
  now: Date,
  baseline: ReservationEventCounts | undefined
): ReservationEventCounts | null => {
  if (schedules.length === 0) return null;

  const normalized = schedules.reduce(
    (accumulator, schedule) => {
      accumulator.pending += Math.max(schedule.count.pending ?? 0, 0);
      const confirmedCount = Math.max(schedule.count.confirmed ?? 0, 0);
      if (confirmedCount > 0) {
        if (isScheduleEnded(dateKey, schedule.endTime, now)) {
          accumulator.completed += confirmedCount;
        } else {
          accumulator.confirmed += confirmedCount;
        }
      }
      return accumulator;
    },
    { pending: 0, confirmed: 0, completed: 0 }
  );

  const completedBaseline = Math.max(baseline?.completed ?? 0, 0);
  const mergedCompleted = Math.max(completedBaseline, normalized.completed);

  const mergedDailyCounts: ReservationEventCounts = {};
  if (normalized.pending > 0) mergedDailyCounts.pending = normalized.pending;
  if (normalized.confirmed > 0)
    mergedDailyCounts.confirmed = normalized.confirmed;
  if (mergedCompleted > 0) mergedDailyCounts.completed = mergedCompleted;

  return Object.keys(mergedDailyCounts).length > 0 ? mergedDailyCounts : null;
};
