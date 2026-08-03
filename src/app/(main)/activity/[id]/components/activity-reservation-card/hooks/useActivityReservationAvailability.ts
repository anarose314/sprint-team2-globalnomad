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
  type AvailableScheduleQueryStatusByMonth,
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

  const availableScheduleQueryStatusByMonth =
    useMemo<AvailableScheduleQueryStatusByMonth>(() => {
      return queryTargetMonths.reduce<AvailableScheduleQueryStatusByMonth>(
        (accumulator, { year, month }, index) => {
          const query = availableScheduleQueries[index];
          const yearMonthKey = `${year}-${String(month).padStart(2, '0')}`;
          let status: AvailableScheduleQueryStatus = 'success';

          if (!query || query.isLoading) {
            status = 'loading';
          } else if (query.isError) {
            status = 'error';
          }

          accumulator[yearMonthKey] = status;
          return accumulator;
        },
        {}
      );
    }, [availableScheduleQueries, queryTargetMonths]);

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
        availableScheduleQueryStatusByMonth,
        myScheduleIds,
        now: new Date(),
      }),
    [
      availableScheduleQueryStatusByMonth,
      availableSchedules,
      myScheduleIds,
      schedules,
    ]
  );

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    const unavailableMonths = Object.entries(
      availableScheduleQueryStatusByMonth
    ).filter(([, status]) => status !== 'success');

    if (unavailableMonths.length === 0) {
      return;
    }

    console.warn(
      `[useActivityReservationAvailability] activityId=${activityId}: 예약 가능 시간을 확인하지 못한 연월의 원본 시간대를 비활성화 상태로 표시 중 (${unavailableMonths
        .map(([yearMonth, status]) => `${yearMonth}:${status}`)
        .join(', ')})`
    );
  }, [activityId, availableScheduleQueryStatusByMonth]);

  return { scheduleByDate };
};
