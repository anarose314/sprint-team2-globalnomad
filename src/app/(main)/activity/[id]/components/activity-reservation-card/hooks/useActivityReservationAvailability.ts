'use client';

import { useEffect, useMemo } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { fetchActivityAvailableSchedule } from '@/app/(main)/activity/[id]/apis/activityAvailableSchedule';
import {
  fetchMyReservedSchedules,
  type MyReservedScheduleItem,
} from '@/app/(main)/activity/[id]/apis/myReservedSchedules';
import {
  type AvailableScheduleQueryStatus,
  buildReservationAvailability,
} from '@/app/(main)/activity/[id]/components/activity-reservation-card/utils/reservationAvailability';
import { normalizeDateKey } from '@/app/(main)/activity/[id]/components/activity-reservation-card/utils/reservationDateTime';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';
import type { ActivitySchedule } from '@/shared/types/activityDetail.types';

const EMPTY_RESERVED_SCHEDULES: MyReservedScheduleItem[] = [];

interface UseActivityReservationAvailabilityProps {
  activityId: number;
  schedules: ActivitySchedule[];
  reservedScheduleIds: number[];
  /** false면 `/my-reservations` 호출을 하지 않는다(비로그인 401 시 전역 로그인 이동 방지). */
  isAuthenticated: boolean;
}

const parseYearMonthFromDateKey = (dateKey: string) => {
  const [year, month] = dateKey.split('-').map(Number);
  return { year, month };
};

export const useActivityReservationAvailability = ({
  activityId,
  schedules,
  reservedScheduleIds,
  isAuthenticated,
}: UseActivityReservationAvailabilityProps) => {
  const queryTargetMonths = useMemo(() => {
    const uniqueYearMonth = new Set<string>();

    schedules.forEach((schedule) => {
      const dateKey = normalizeDateKey(schedule.date);
      const { year, month } = parseYearMonthFromDateKey(dateKey);
      if (Number.isInteger(year) && Number.isInteger(month)) {
        uniqueYearMonth.add(`${year}-${String(month).padStart(2, '0')}`);
      }
    });

    return Array.from(uniqueYearMonth).map((yearMonth) => {
      const [year, month] = yearMonth.split('-').map(Number);
      return { year, month };
    });
  }, [schedules]);

  const availableScheduleQueries = useQueries({
    queries: queryTargetMonths.map(({ year, month }) => ({
      queryKey: [
        ...QUERY_KEYS.ACTIVITY_AVAILABLE_SCHEDULE,
        activityId,
        year,
        month,
      ],
      queryFn: () =>
        fetchActivityAvailableSchedule({
          activityId,
          year,
          month,
        }),
    })),
  });

  const availableSchedules = useMemo(
    () => availableScheduleQueries.flatMap((query) => query.data ?? []),
    [availableScheduleQueries]
  );

  const availableScheduleQueryStatus =
    useMemo<AvailableScheduleQueryStatus>(() => {
      if (availableScheduleQueries.some((query) => query.isLoading)) {
        return 'loading';
      }
      if (availableScheduleQueries.some((query) => query.isError)) {
        return 'error';
      }
      return 'success';
    }, [availableScheduleQueries]);

  const { data: myReservedSchedules = EMPTY_RESERVED_SCHEDULES } = useQuery({
    queryKey: [...QUERY_KEYS.MY_RESERVATIONS, 'reservedSchedules'],
    queryFn: fetchMyReservedSchedules,
    enabled: isAuthenticated,
  });

  const myReservedScheduleIds = useMemo(() => {
    return myReservedSchedules
      .filter((reservation) => reservation.activityId === activityId)
      .map((reservation) => reservation.scheduleId);
  }, [activityId, myReservedSchedules]);

  const blockedScheduleIds = useMemo(() => {
    return Array.from(
      new Set([...myReservedScheduleIds, ...reservedScheduleIds])
    );
  }, [myReservedScheduleIds, reservedScheduleIds]);

  const { availableScheduleByDate, usesFallbackSchedule } = useMemo(
    () =>
      buildReservationAvailability({
        schedules,
        availableSchedules,
        availableScheduleQueryStatus,
        blockedScheduleIds,
        now: new Date(),
      }),
    [
      availableScheduleQueryStatus,
      availableSchedules,
      blockedScheduleIds,
      schedules,
    ]
  );

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    if (!usesFallbackSchedule || availableScheduleQueryStatus === 'loading') {
      return;
    }

    console.warn(
      `[useActivityReservationAvailability] activityId=${activityId}: 예약 가능 시간 API 대신 원본 스케줄로 대체 표시 중 (status=${availableScheduleQueryStatus})`
    );
  }, [activityId, availableScheduleQueryStatus, usesFallbackSchedule]);

  return { availableScheduleByDate, usesFallbackSchedule };
};
