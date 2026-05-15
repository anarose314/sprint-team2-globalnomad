import { useMemo } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { fetchActivityDetail } from '@/app/(main)/activity/apis/activities';
import { fetchReservationDashboard } from '@/app/(main)/my/activities-dashboard/apis/reservationDashboard';
import { fetchActivityReservations } from '@/app/(main)/my/activities-dashboard/apis/reservations';
import { fetchReservedSchedule } from '@/app/(main)/my/activities-dashboard/apis/reservedSchedule';
import {
  ReservationDetailData,
  ReservationEventCounts,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import { buildReservationDetailData } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/utils/mergeReservationDetailData';
import { isScheduleEnded } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/utils/scheduleStatus';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';
import { ActivitySchedule } from '@/shared/types/activityDetail.types';
import { ReservedScheduleItem } from '@/shared/types/reservedSchedule.types';
import { formatDateKey } from '@/shared/utils/formatDate';

interface UseReservationCalendarDataProps {
  activityId: number | null;
  currentYear: number;
  currentMonth: number;
  reservedScheduleDateKey: string | null;
}

const normalizeDateKey = (rawDate: string) => {
  const trimmed = rawDate.trim();
  const shortDate = trimmed.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(shortDate)) {
    return shortDate;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return trimmed;
  return formatDateKey(parsed);
};

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
    queryKey: [...QUERY_KEYS.ACTIVITIES, 'detailSchedules', activityId],
    queryFn: async () => {
      const detail = await fetchActivityDetail(activityId as number);
      return detail.schedules ?? [];
    },
    enabled: activityId !== null && Boolean(reservedScheduleDateKey),
    staleTime: 5 * 60_000,
  });

  const schedulesBySelectedDate = useMemo(
    () =>
      reservedScheduleDateKey
        ? activitySchedules
            .filter(
              (schedule: ActivitySchedule) =>
                normalizeDateKey(schedule.date) === reservedScheduleDateKey
            )
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
        : [],
    [activitySchedules, reservedScheduleDateKey]
  );

  const scheduleCandidates = useMemo(
    () =>
      schedulesBySelectedDate.map((schedule) => ({
        scheduleId: schedule.id,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
      })),
    [schedulesBySelectedDate]
  );

  /**
   * reserved-schedule이 날짜별 스케줄·집계를 모두 주면 status별 N번 호출을 생략한다.
   * (행이 비거나 집계가 전부 0이면 예약 목록 totalCount로 보정하기 위해 per-status 조회 유지)
   */
  const shouldFetchPerScheduleReservationCounts = useMemo(() => {
    if (!reservedScheduleDateKey || scheduleCandidates.length === 0) {
      return false;
    }
    if (reservedSchedules.length === 0) return true;

    const reservedByScheduleId = new Map(
      reservedSchedules.map((row) => [row.scheduleId, row])
    );
    const coversAllActivitySlots = scheduleCandidates.every((candidate) =>
      reservedByScheduleId.has(candidate.scheduleId)
    );
    if (!coversAllActivitySlots) return true;

    const hasAnyNonZeroCount = reservedSchedules.some((row) => {
      const pending = Math.max(row.count.pending, 0);
      const confirmed = Math.max(row.count.confirmed, 0);
      const declined = Math.max(row.count.declined, 0);
      const completed = Math.max(row.count.completed ?? 0, 0);
      return pending + confirmed + declined + completed > 0;
    });

    return !hasAnyNonZeroCount;
  }, [reservedScheduleDateKey, reservedSchedules, scheduleCandidates]);

  const scheduleStatusQueries = useQueries({
    queries: shouldFetchPerScheduleReservationCounts
      ? scheduleCandidates.flatMap((schedule) =>
          (['pending', 'confirmed', 'declined'] as const).map((status) => ({
            queryKey: [
              ...QUERY_KEYS.MY_ACTIVITY_RESERVATIONS,
              activityId,
              reservedScheduleDateKey,
              schedule.scheduleId,
              status,
              'totalCount',
            ],
            queryFn: () =>
              fetchActivityReservations({
                activityId: activityId as number,
                scheduleId: schedule.scheduleId,
                status,
              }),
            enabled: activityId !== null && Boolean(reservedScheduleDateKey),
            staleTime: 60_000,
          }))
        )
      : [],
  });

  const countsFromReservedScheduleByScheduleId = useMemo(() => {
    const map = new Map<
      number,
      {
        pending: number;
        confirmed: number;
        declined: number;
        completed: number;
      }
    >();
    for (const row of reservedSchedules) {
      map.set(row.scheduleId, {
        pending: Math.max(row.count.pending, 0),
        confirmed: Math.max(row.count.confirmed, 0),
        declined: Math.max(row.count.declined, 0),
        completed: Math.max(row.count.completed ?? 0, 0),
      });
    }
    return map;
  }, [reservedSchedules]);

  const confirmedCountByScheduleId = useMemo(() => {
    const counts = scheduleCandidates.reduce<Record<number, number>>(
      (accumulator, schedule) => {
        accumulator[schedule.scheduleId] = 0;
        return accumulator;
      },
      {}
    );

    scheduleCandidates.forEach((schedule, scheduleIndex) => {
      const fromReserved =
        countsFromReservedScheduleByScheduleId.get(schedule.scheduleId)
          ?.confirmed ?? 0;
      if (shouldFetchPerScheduleReservationCounts) {
        const queryIndex = scheduleIndex * 3 + 1;
        const fromQuery =
          scheduleStatusQueries[queryIndex]?.data?.totalCount ?? 0;
        counts[schedule.scheduleId] = Math.max(fromReserved, fromQuery);
      } else {
        counts[schedule.scheduleId] = fromReserved;
      }
    });

    return counts;
  }, [
    countsFromReservedScheduleByScheduleId,
    scheduleCandidates,
    scheduleStatusQueries,
    shouldFetchPerScheduleReservationCounts,
  ]);

  const pendingCountByScheduleId = useMemo(() => {
    const counts = scheduleCandidates.reduce<Record<number, number>>(
      (accumulator, schedule) => {
        accumulator[schedule.scheduleId] = 0;
        return accumulator;
      },
      {}
    );

    scheduleCandidates.forEach((schedule, scheduleIndex) => {
      const fromReserved =
        countsFromReservedScheduleByScheduleId.get(schedule.scheduleId)
          ?.pending ?? 0;
      if (shouldFetchPerScheduleReservationCounts) {
        const queryIndex = scheduleIndex * 3;
        const fromQuery =
          scheduleStatusQueries[queryIndex]?.data?.totalCount ?? 0;
        counts[schedule.scheduleId] = Math.max(fromReserved, fromQuery);
      } else {
        counts[schedule.scheduleId] = fromReserved;
      }
    });

    return counts;
  }, [
    countsFromReservedScheduleByScheduleId,
    scheduleCandidates,
    scheduleStatusQueries,
    shouldFetchPerScheduleReservationCounts,
  ]);

  const declinedCountByScheduleId = useMemo(() => {
    const counts = scheduleCandidates.reduce<Record<number, number>>(
      (accumulator, schedule) => {
        accumulator[schedule.scheduleId] = 0;
        return accumulator;
      },
      {}
    );

    scheduleCandidates.forEach((schedule, scheduleIndex) => {
      const fromReserved =
        countsFromReservedScheduleByScheduleId.get(schedule.scheduleId)
          ?.declined ?? 0;
      if (shouldFetchPerScheduleReservationCounts) {
        const queryIndex = scheduleIndex * 3 + 2;
        const fromQuery =
          scheduleStatusQueries[queryIndex]?.data?.totalCount ?? 0;
        counts[schedule.scheduleId] = Math.max(fromReserved, fromQuery);
      } else {
        counts[schedule.scheduleId] = fromReserved;
      }
    });

    return counts;
  }, [
    countsFromReservedScheduleByScheduleId,
    scheduleCandidates,
    scheduleStatusQueries,
    shouldFetchPerScheduleReservationCounts,
  ]);

  /**
   * reserved-schedule 행이 비거나 집계가 늦어도,
   * 체험 상세 스케줄 + 예약 목록 totalCount(pending/confirmed/declined)로 슬롯을 복구한다.
   * (예약 목록 API는 status=completed를 지원하지 않아 completed 건수는 reserved-schedule만 사용)
   */
  const reservedScheduleRowsForDetail = useMemo((): ReservedScheduleItem[] => {
    const mergeCountsWithQueries = (
      row: ReservedScheduleItem
    ): ReservedScheduleItem => {
      const id = row.scheduleId;
      return {
        ...row,
        count: {
          pending: Math.max(
            row.count.pending,
            pendingCountByScheduleId[id] ?? 0
          ),
          confirmed: Math.max(
            row.count.confirmed,
            confirmedCountByScheduleId[id] ?? 0
          ),
          declined: Math.max(
            row.count.declined,
            declinedCountByScheduleId[id] ?? 0
          ),
          completed: Math.max(row.count.completed ?? 0, 0),
        },
      };
    };

    const enrichedReserved = reservedSchedules.map(mergeCountsWithQueries);
    const reservedById = new Map(
      enrichedReserved.map((row) => [row.scheduleId, row])
    );

    const fromActivity = scheduleCandidates.map((candidate) => {
      const existing = reservedById.get(candidate.scheduleId);
      if (existing) return existing;
      const id = candidate.scheduleId;
      return {
        scheduleId: id,
        startTime: candidate.startTime,
        endTime: candidate.endTime,
        count: {
          pending: pendingCountByScheduleId[id] ?? 0,
          confirmed: confirmedCountByScheduleId[id] ?? 0,
          declined: declinedCountByScheduleId[id] ?? 0,
          completed: 0,
        },
      };
    });

    const activityIds = new Set(
      scheduleCandidates.map((candidate) => candidate.scheduleId)
    );
    const extras = enrichedReserved.filter(
      (row) => !activityIds.has(row.scheduleId)
    );

    return [...fromActivity, ...extras].sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
  }, [
    reservedSchedules,
    scheduleCandidates,
    pendingCountByScheduleId,
    confirmedCountByScheduleId,
    declinedCountByScheduleId,
  ]);

  const eventCountsByDate = useMemo<
    Record<string, ReservationEventCounts>
  >(() => {
    const todayDateKey = formatDateKey(new Date());
    const eventCounts = reservationDashboard.reduce<
      Record<string, ReservationEventCounts>
    >((accumulator, item) => {
      const itemDateKey = normalizeDateKey(item.date);
      const completed = Math.max(item.reservations.completed, 0);
      const confirmed = Math.max(item.reservations.confirmed, 0);
      const pending = Math.max(item.reservations.pending, 0);
      const isPastDate = itemDateKey < todayDateKey;
      const shiftedCompleted = isPastDate ? completed + confirmed : completed;
      const shiftedConfirmed = isPastDate ? 0 : confirmed;

      const dailyEventCounts: ReservationEventCounts = {};
      if (pending > 0) dailyEventCounts.pending = pending;
      if (shiftedConfirmed > 0) dailyEventCounts.confirmed = shiftedConfirmed;
      if (shiftedCompleted > 0) dailyEventCounts.completed = shiftedCompleted;

      if (Object.keys(dailyEventCounts).length > 0) {
        accumulator[itemDateKey] = dailyEventCounts;
      }

      return accumulator;
    }, {});

    // 현재 선택 날짜는 reserved-schedule 집계값으로 보정한다.
    if (reservedScheduleDateKey) {
      const now = new Date();
      const normalized = reservedSchedules.reduce(
        (accumulator, schedule) => {
          accumulator.pending += Math.max(schedule.count.pending, 0);
          accumulator.completed += Math.max(schedule.count.completed ?? 0, 0);
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
    if (!reservedScheduleDateKey) {
      return { timeSlots: [] };
    }

    const builtFromReservedSchedules = buildReservationDetailData({
      reservedSchedules: reservedScheduleRowsForDetail,
    });

    if (builtFromReservedSchedules.timeSlots.length > 0) {
      return builtFromReservedSchedules;
    }

    const hasAnyScheduleReservation = scheduleCandidates.some((schedule) => {
      const scheduleId = schedule.scheduleId;
      return (
        (pendingCountByScheduleId[scheduleId] ?? 0) +
          (confirmedCountByScheduleId[scheduleId] ?? 0) +
          (declinedCountByScheduleId[scheduleId] ?? 0) >
        0
      );
    });

    if (!hasAnyScheduleReservation) {
      const selectedDayCounts = eventCountsByDate[reservedScheduleDateKey];
      const pendingCount = Math.max(selectedDayCounts?.pending ?? 0, 0);
      const confirmedCount = Math.max(selectedDayCounts?.confirmed ?? 0, 0);
      const completedCount = Math.max(selectedDayCounts?.completed ?? 0, 0);
      const hasAnyDailyReservation =
        pendingCount + confirmedCount + completedCount > 0;

      if (!hasAnyDailyReservation) {
        return { timeSlots: [] };
      }

      const fallbackCandidates =
        reservedSchedules.length > 0
          ? [...reservedSchedules]
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((schedule) => ({
                scheduleId: schedule.scheduleId,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
              }))
          : scheduleCandidates;

      if (fallbackCandidates.length === 0) {
        return { timeSlots: [] };
      }

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
            pending:
              schedule.scheduleId === targetScheduleId ? pendingCount : 0,
            // completed 조회/전환 없이 confirmed 라인에서 유지하고, 뱃지만 UI에서 완료로 바꾼다.
            confirmed:
              schedule.scheduleId === targetScheduleId
                ? confirmedCount + completedCount
                : 0,
            declined: 0,
            completed: 0,
          },
        })),
      });
    }

    const candidateSchedules =
      scheduleCandidates.length > 0
        ? scheduleCandidates
        : [...reservedSchedules]
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
            .map((schedule) => ({
              scheduleId: schedule.scheduleId,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
            }));

    if (candidateSchedules.length === 0) {
      return { timeSlots: [] };
    }

    const synthesizedReservedSchedules = candidateSchedules.map((schedule) => {
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
  }, [
    confirmedCountByScheduleId,
    declinedCountByScheduleId,
    eventCountsByDate,
    pendingCountByScheduleId,
    reservedScheduleDateKey,
    reservedScheduleRowsForDetail,
    scheduleCandidates,
    reservedSchedules,
    shouldFetchPerScheduleReservationCounts,
  ]);

  return {
    detailData,
    eventCountsByDate,
  };
};
