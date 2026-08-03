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
import { reservationKeys } from '@/shared/queryKeys/reservationKeys';
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
      queryKey: reservationKeys.availableSchedule.byMonth(
        activityId,
        year,
        month
      ),
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
    queryKey: reservationKeys.myReservations.reservedSchedules(),
    queryFn: fetchMyReservedSchedules,
    enabled: isAuthenticated,
  });

  const myReservedScheduleIds = useMemo(() => {
    return myReservedSchedules
      .filter((reservation) => reservation.activityId === activityId)
      .map((reservation) => reservation.scheduleId);
  }, [activityId, myReservedSchedules]);

  const myScheduleIds = useMemo(() => {
    return Array.from(
      new Set([...myReservedScheduleIds, ...reservedScheduleIds])
    );
  }, [myReservedScheduleIds, reservedScheduleIds]);

  const { scheduleByDate } = useMemo(
    () =>
      buildReservationAvailability({
        schedules,
        availableSchedules,
        availableScheduleQueryStatus,
        myScheduleIds,
        now: new Date(),
      }),
    [availableScheduleQueryStatus, availableSchedules, myScheduleIds, schedules]
  );

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    if (availableScheduleQueryStatus === 'success') {
      return;
    }

    console.warn(
      `[useActivityReservationAvailability] activityId=${activityId}: 예약 가능 시간 조회가 ${availableScheduleQueryStatus} 상태라 원본 시간대를 비활성화 상태로 표시 중`
    );
  }, [activityId, availableScheduleQueryStatus]);

  return { scheduleByDate };
};
