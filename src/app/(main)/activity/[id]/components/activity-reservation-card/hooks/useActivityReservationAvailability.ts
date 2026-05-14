'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchActivityAvailableSchedule } from '@/app/(main)/activity/[id]/apis/activityAvailableSchedule';
import { fetchMyReservedSchedules } from '@/app/(main)/activity/[id]/apis/myReservedSchedules';
import type { TimeSlot } from '@/app/(main)/activity/[id]/components/activity-reservation-card/activityReservationCard.types';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';
import type { ActivitySchedule } from '@/shared/types/activityDetail.types';
import { formatDateKey } from '@/shared/utils/formatDate';

interface UseActivityReservationAvailabilityProps {
  activityId: number;
  schedules: ActivitySchedule[];
  reservedScheduleIds: number[];
}

const normalizeDateKey = (rawDate: string) => {
  const trimmed = rawDate.trim();
  const shortDate = trimmed.slice(0, 10);

  if (/^\d{4}-\d{2}-\d{2}$/.test(shortDate)) {
    return shortDate;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return trimmed;
  }

  return formatDateKey(parsed);
};

const parseTimeToHourMinute = (time: string) => {
  const [hourText, minuteText] = time.split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  return { hour, minute };
};

const isUpcomingTimeSlot = (dateKey: string, startTime: string, now: Date) => {
  const [yearText, monthText, dayText] = dateKey.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const parsedTime = parseTimeToHourMinute(startTime);

  if (!parsedTime) {
    return true;
  }

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return true;
  }

  const startDateTime = new Date(
    year,
    month - 1,
    day,
    parsedTime.hour,
    parsedTime.minute,
    0,
    0
  );

  if (Number.isNaN(startDateTime.getTime())) {
    return true;
  }

  return startDateTime.getTime() > now.getTime();
};

export const useActivityReservationAvailability = ({
  activityId,
  schedules,
  reservedScheduleIds,
}: UseActivityReservationAvailabilityProps) => {
  const {
    data: availableSchedules = [],
    isLoading: isAvailableSchedulesLoading,
    isError: isAvailableSchedulesError,
  } = useQuery({
    queryKey: [...QUERY_KEYS.ACTIVITY_AVAILABLE_SCHEDULE, activityId],
    queryFn: () =>
      fetchActivityAvailableSchedule({
        activityId,
      }),
  });

  const { data: myReservedSchedules = [] } = useQuery({
    queryKey: [...QUERY_KEYS.MY_RESERVATIONS, 'reservedSchedules'],
    queryFn: fetchMyReservedSchedules,
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

  const fallbackScheduleByDate = useMemo(() => {
    const now = new Date();

    return schedules.reduce<Record<string, TimeSlot[]>>(
      (accumulator, schedule) => {
        if (blockedScheduleIds.includes(schedule.id)) {
          return accumulator;
        }

        const dateKey = normalizeDateKey(schedule.date);
        if (!isUpcomingTimeSlot(dateKey, schedule.startTime, now)) {
          return accumulator;
        }

        const nextSlot: TimeSlot = {
          id: schedule.id,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
        };

        if (!accumulator[dateKey]) {
          accumulator[dateKey] = [nextSlot];
        } else {
          accumulator[dateKey].push(nextSlot);
        }

        return accumulator;
      },
      {}
    );
  }, [blockedScheduleIds, schedules]);

  const availableScheduleByDate = useMemo(() => {
    const now = new Date();

    const fromAvailableApi = availableSchedules.reduce<
      Record<string, (typeof availableSchedules)[number]['times']>
    >((accumulator, item) => {
      const dateKey = normalizeDateKey(item.date);
      const filteredTimes = item.times.filter(
        (time) =>
          !blockedScheduleIds.includes(time.id) &&
          isUpcomingTimeSlot(dateKey, time.startTime, now)
      );

      if (filteredTimes.length > 0) {
        accumulator[dateKey] = filteredTimes;
      }

      return accumulator;
    }, {});

    if (
      isAvailableSchedulesLoading ||
      isAvailableSchedulesError ||
      Object.keys(fromAvailableApi).length === 0
    ) {
      return fallbackScheduleByDate;
    }

    return Object.entries(fromAvailableApi).reduce<Record<string, TimeSlot[]>>(
      (accumulator, [dateKey, times]) => {
        accumulator[dateKey] = times.map((time) => ({
          id: time.id,
          startTime: time.startTime,
          endTime: time.endTime,
        }));
        return accumulator;
      },
      {}
    );
  }, [
    availableSchedules,
    blockedScheduleIds,
    fallbackScheduleByDate,
    isAvailableSchedulesError,
    isAvailableSchedulesLoading,
  ]);

  return { availableScheduleByDate };
};
