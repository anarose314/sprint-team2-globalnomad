import { useMemo } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { fetchActivityDetail } from '@/app/(main)/activity/apis/activities';
import { fetchReservationDashboard } from '@/app/(main)/my/activities-dashboard/apis/reservationDashboard';
import { fetchActivityReservations } from '@/app/(main)/my/activities-dashboard/apis/reservations';
import { fetchReservedSchedule } from '@/app/(main)/my/activities-dashboard/apis/reservedSchedule';
import { useCurrentTimestamp } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/useCurrentTimestamp';
import {
  ReservationDetailData,
  ReservationEventCounts,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import { buildReservationCalendarDetailData } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/utils/buildReservationCalendarDetailData';
import { isScheduleEnded } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/utils/scheduleStatus';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';
import { ActivitySchedule } from '@/shared/types/activityDetail.types';
import { ReservedScheduleItem } from '@/shared/types/reservedSchedule.types';
import {
  formatDateKey,
  normalizeCalendarDateKey,
} from '@/shared/utils/formatDate';

interface UseReservationCalendarDataProps {
  activityId: number | null;
  currentYear: number;
  currentMonth: number;
  reservedScheduleDateKey: string | null;
}

const SCHEDULE_RESERVATION_COUNT_STATUSES = [
  'pending',
  'confirmed',
  'declined',
] as const;

type ScheduleReservationCountStatus =
  (typeof SCHEDULE_RESERVATION_COUNT_STATUSES)[number];

type ScheduleReservationCountTotals = Record<
  ScheduleReservationCountStatus,
  number
>;

const emptyScheduleReservationCountTotals =
  (): ScheduleReservationCountTotals => ({
    pending: 0,
    confirmed: 0,
    declined: 0,
  });

/**
 * `useQueries`에 넣은 순서(scheduleCandidates × STATUSES)와 동일하게
 * 응답 배열을 스케줄 ID → 상태별 totalCount 맵으로 변환한다.
 */
const mapScheduleReservationQueryResultsToTotalsByScheduleId = (
  scheduleCandidates: ReadonlyArray<{ scheduleId: number }>,
  queryResults: ReadonlyArray<{ data?: { totalCount: number } | undefined }>
): Map<number, ScheduleReservationCountTotals> => {
  const map = new Map<number, ScheduleReservationCountTotals>();
  const statuses = SCHEDULE_RESERVATION_COUNT_STATUSES;
  let queryIndex = 0;

  for (const candidate of scheduleCandidates) {
    const totals = emptyScheduleReservationCountTotals();
    for (const status of statuses) {
      totals[status] = Math.max(
        queryResults[queryIndex]?.data?.totalCount ?? 0,
        0
      );
      queryIndex += 1;
    }
    map.set(candidate.scheduleId, totals);
  }

  return map;
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
  const nowTimestamp = useCurrentTimestamp(activityId !== null);
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

  const { data: reservedSchedules = [], isFetched: isReservedScheduleFetched } =
    useQuery({
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
        activityId !== null && Boolean(reservedScheduleDateKey)
          ? 60_000
          : false,
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
                normalizeCalendarDateKey(schedule.date) ===
                reservedScheduleDateKey
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
   * reserved-schedule이 날짜별 스케줄·집계를 모두 주면 status별 3×N 호출 생략
   * (행이 비거나 집계가 전부 0이면 예약 목록 totalCount로 보정하기 위해 per-status 조회 유지)
   *
   * reserved 응답 전에는 `data`가 기본값 `[]`라서, 그때 판단하면 불필요한 다수 요청이 나가므로
   * `isReservedScheduleFetched` 이후에만 본 플래그 사용, 벌크 API가 생기면 이 분기 전체를 대체 가능
   */
  const shouldFetchPerScheduleReservationCounts = useMemo(() => {
    if (!reservedScheduleDateKey || scheduleCandidates.length === 0) {
      return false;
    }
    if (!isReservedScheduleFetched) return false;

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
  }, [
    isReservedScheduleFetched,
    reservedScheduleDateKey,
    reservedSchedules,
    scheduleCandidates,
  ]);

  /**
   * 스케줄×상태별 예약 목록 totalCount (백엔드 벌크 집계 API 부재 시 폴백)
   * `shouldFetchPerScheduleReservationCounts`가 false면 빈 배열을 넘겨 요청을 만들지 않음
   */
  const scheduleStatusQueries = useQueries({
    queries: shouldFetchPerScheduleReservationCounts
      ? scheduleCandidates.flatMap((schedule) =>
          SCHEDULE_RESERVATION_COUNT_STATUSES.map((status) => ({
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
            enabled:
              activityId !== null &&
              Boolean(reservedScheduleDateKey) &&
              shouldFetchPerScheduleReservationCounts,
            staleTime: 60_000,
          }))
        )
      : [],
  });

  const listApiTotalCountByScheduleId = useMemo(
    () =>
      shouldFetchPerScheduleReservationCounts
        ? mapScheduleReservationQueryResultsToTotalsByScheduleId(
            scheduleCandidates,
            scheduleStatusQueries
          )
        : new Map<number, ScheduleReservationCountTotals>(),
    [
      scheduleCandidates,
      scheduleStatusQueries,
      shouldFetchPerScheduleReservationCounts,
    ]
  );

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

    scheduleCandidates.forEach((schedule) => {
      const fromReserved =
        countsFromReservedScheduleByScheduleId.get(schedule.scheduleId)
          ?.confirmed ?? 0;
      if (shouldFetchPerScheduleReservationCounts) {
        const fromList =
          listApiTotalCountByScheduleId.get(schedule.scheduleId)?.confirmed ??
          0;
        counts[schedule.scheduleId] = Math.max(fromReserved, fromList);
      } else {
        counts[schedule.scheduleId] = fromReserved;
      }
    });

    return counts;
  }, [
    countsFromReservedScheduleByScheduleId,
    listApiTotalCountByScheduleId,
    scheduleCandidates,
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

    scheduleCandidates.forEach((schedule) => {
      const fromReserved =
        countsFromReservedScheduleByScheduleId.get(schedule.scheduleId)
          ?.pending ?? 0;
      if (shouldFetchPerScheduleReservationCounts) {
        const fromList =
          listApiTotalCountByScheduleId.get(schedule.scheduleId)?.pending ?? 0;
        counts[schedule.scheduleId] = Math.max(fromReserved, fromList);
      } else {
        counts[schedule.scheduleId] = fromReserved;
      }
    });

    return counts;
  }, [
    countsFromReservedScheduleByScheduleId,
    listApiTotalCountByScheduleId,
    scheduleCandidates,
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

    scheduleCandidates.forEach((schedule) => {
      const fromReserved =
        countsFromReservedScheduleByScheduleId.get(schedule.scheduleId)
          ?.declined ?? 0;
      if (shouldFetchPerScheduleReservationCounts) {
        const fromList =
          listApiTotalCountByScheduleId.get(schedule.scheduleId)?.declined ?? 0;
        counts[schedule.scheduleId] = Math.max(fromReserved, fromList);
      } else {
        counts[schedule.scheduleId] = fromReserved;
      }
    });

    return counts;
  }, [
    countsFromReservedScheduleByScheduleId,
    listApiTotalCountByScheduleId,
    scheduleCandidates,
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
    const now = new Date(nowTimestamp);
    const todayDateKey = formatDateKey(now);
    const eventCounts = reservationDashboard.reduce<
      Record<string, ReservationEventCounts>
    >((accumulator, item) => {
      const itemDateKey = normalizeCalendarDateKey(item.date);
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
  }, [
    nowTimestamp,
    reservationDashboard,
    reservedScheduleDateKey,
    reservedSchedules,
  ]);

  const detailData = useMemo<ReservationDetailData>(
    () =>
      buildReservationCalendarDetailData({
        reservedScheduleDateKey,
        reservedScheduleRowsForDetail,
        scheduleCandidates,
        pendingCountByScheduleId,
        confirmedCountByScheduleId,
        declinedCountByScheduleId,
        eventCountsByDate,
        reservedSchedules,
      }),
    [
      confirmedCountByScheduleId,
      declinedCountByScheduleId,
      eventCountsByDate,
      pendingCountByScheduleId,
      reservedScheduleDateKey,
      reservedScheduleRowsForDetail,
      scheduleCandidates,
      reservedSchedules,
    ]
  );

  return {
    detailData,
    eventCountsByDate,
  };
};
