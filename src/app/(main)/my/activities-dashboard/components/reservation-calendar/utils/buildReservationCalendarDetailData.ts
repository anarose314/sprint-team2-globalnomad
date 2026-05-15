import type {
  ReservationDetailData,
  ReservationEventCounts,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import { buildReservationDetailData } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/utils/mergeReservationDetailData';
import { isScheduleEnded } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/utils/scheduleStatus';
import type { ReservedScheduleItem } from '@/shared/types/reservedSchedule.types';

export interface ScheduleSlotCandidate {
  scheduleId: number;
  startTime: string;
  endTime: string;
}

export interface BuildReservationCalendarDetailDataInput {
  reservedScheduleDateKey: string | null;
  reservedScheduleRowsForDetail: ReservedScheduleItem[];
  scheduleCandidates: ScheduleSlotCandidate[];
  pendingCountByScheduleId: Record<number, number>;
  confirmedCountByScheduleId: Record<number, number>;
  declinedCountByScheduleId: Record<number, number>;
  eventCountsByDate: Record<string, ReservationEventCounts>;
  reservedSchedules: ReservedScheduleItem[];
}

const emptyDetail = (): ReservationDetailData => ({ timeSlots: [] });

const sumPendingConfirmedDeclined = (
  scheduleId: number,
  pending: Record<number, number>,
  confirmed: Record<number, number>,
  declined: Record<number, number>
) =>
  (pending[scheduleId] ?? 0) +
  (confirmed[scheduleId] ?? 0) +
  (declined[scheduleId] ?? 0);

/** 병합된 reserved 행으로 슬롯이 나오면 그대로 사용 */
const tryDetailFromMergedReservedRows = (
  rows: ReservedScheduleItem[]
): ReservationDetailData | null => {
  const built = buildReservationDetailData({ reservedSchedules: rows });
  return built.timeSlots.length > 0 ? built : null;
};

const hasAnyPerScheduleListCount = (
  scheduleCandidates: ScheduleSlotCandidate[],
  pendingCountByScheduleId: Record<number, number>,
  confirmedCountByScheduleId: Record<number, number>,
  declinedCountByScheduleId: Record<number, number>
) =>
  scheduleCandidates.some(
    (schedule) =>
      sumPendingConfirmedDeclined(
        schedule.scheduleId,
        pendingCountByScheduleId,
        confirmedCountByScheduleId,
        declinedCountByScheduleId
      ) > 0
  );

/**
 * reserved·스케줄별 API 집계가 비어 있을 때,
 * 월간 대시보드 일별 집계로 슬롯을 한 줄이라도 복구한다.
 */
const buildDetailFromDayDashboardFallback = (
  reservedScheduleDateKey: string,
  eventCountsByDate: Record<string, ReservationEventCounts>,
  reservedSchedules: ReservedScheduleItem[],
  scheduleCandidates: ScheduleSlotCandidate[]
): ReservationDetailData | null => {
  const selectedDayCounts = eventCountsByDate[reservedScheduleDateKey];
  const pendingCount = Math.max(selectedDayCounts?.pending ?? 0, 0);
  const confirmedCount = Math.max(selectedDayCounts?.confirmed ?? 0, 0);
  const completedCount = Math.max(selectedDayCounts?.completed ?? 0, 0);
  const hasAnyDailyReservation =
    pendingCount + confirmedCount + completedCount > 0;

  if (!hasAnyDailyReservation) return null;

  const fallbackCandidates: ScheduleSlotCandidate[] =
    reservedSchedules.length > 0
      ? [...reservedSchedules]
          .sort((a, b) => a.startTime.localeCompare(b.startTime))
          .map((schedule) => ({
            scheduleId: schedule.scheduleId,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
          }))
      : scheduleCandidates;

  if (fallbackCandidates.length === 0) return null;

  const now = new Date();
  const endedSchedules = fallbackCandidates.filter((schedule) =>
    isScheduleEnded(reservedScheduleDateKey, schedule.endTime, now)
  );
  const targetScheduleId =
    endedSchedules[0]?.scheduleId ?? fallbackCandidates[0].scheduleId;

  return buildReservationDetailData({
    reservedSchedules: fallbackCandidates.map((schedule) => ({
      scheduleId: schedule.scheduleId,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      count: {
        pending: schedule.scheduleId === targetScheduleId ? pendingCount : 0,
        /* completed는 목록 API 미지원; 일별 완료 수는 confirmed 합산으로 슬롯만 살린다. */
        confirmed:
          schedule.scheduleId === targetScheduleId
            ? confirmedCount + completedCount
            : 0,
        declined: 0,
        completed: 0,
      },
    })),
  });
};

const resolveCandidateSchedules = (
  scheduleCandidates: ScheduleSlotCandidate[],
  reservedSchedules: ReservedScheduleItem[]
): ScheduleSlotCandidate[] => {
  if (scheduleCandidates.length > 0) return scheduleCandidates;
  return [...reservedSchedules]
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .map((schedule) => ({
      scheduleId: schedule.scheduleId,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
    }));
};

/** 스케줄별 pending/confirmed/declined 집계로 상세 슬롯 합성 */
const buildDetailFromPerScheduleCounts = (
  candidateSchedules: ScheduleSlotCandidate[],
  pendingCountByScheduleId: Record<number, number>,
  confirmedCountByScheduleId: Record<number, number>,
  declinedCountByScheduleId: Record<number, number>
): ReservationDetailData => {
  const synthesizedReservedSchedules: ReservedScheduleItem[] =
    candidateSchedules.map((schedule) => {
      const scheduleId = schedule.scheduleId;
      return {
        scheduleId,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        count: {
          pending: pendingCountByScheduleId[scheduleId] ?? 0,
          confirmed: confirmedCountByScheduleId[scheduleId] ?? 0,
          declined: declinedCountByScheduleId[scheduleId] ?? 0,
          completed: 0,
        },
      };
    });

  return buildReservationDetailData({
    reservedSchedules: synthesizedReservedSchedules,
  });
};

/**
 * 예약 상세 패널용 `detailData`를 단계별로 조합한다.
 * (1) 병합 reserved 행 → (2) 일별 대시보드 폴백 → (3) 스케줄별 목록 집계 합성)
 */
export const buildReservationCalendarDetailData = ({
  reservedScheduleDateKey,
  reservedScheduleRowsForDetail,
  scheduleCandidates,
  pendingCountByScheduleId,
  confirmedCountByScheduleId,
  declinedCountByScheduleId,
  eventCountsByDate,
  reservedSchedules,
}: BuildReservationCalendarDetailDataInput): ReservationDetailData => {
  if (!reservedScheduleDateKey) {
    return emptyDetail();
  }

  const fromMerged = tryDetailFromMergedReservedRows(
    reservedScheduleRowsForDetail
  );
  if (fromMerged) return fromMerged;

  if (
    !hasAnyPerScheduleListCount(
      scheduleCandidates,
      pendingCountByScheduleId,
      confirmedCountByScheduleId,
      declinedCountByScheduleId
    )
  ) {
    const fromDashboard = buildDetailFromDayDashboardFallback(
      reservedScheduleDateKey,
      eventCountsByDate,
      reservedSchedules,
      scheduleCandidates
    );
    if (fromDashboard) return fromDashboard;
    return emptyDetail();
  }

  const candidateSchedules = resolveCandidateSchedules(
    scheduleCandidates,
    reservedSchedules
  );

  if (candidateSchedules.length === 0) {
    return emptyDetail();
  }

  return buildDetailFromPerScheduleCounts(
    candidateSchedules,
    pendingCountByScheduleId,
    confirmedCountByScheduleId,
    declinedCountByScheduleId
  );
};
