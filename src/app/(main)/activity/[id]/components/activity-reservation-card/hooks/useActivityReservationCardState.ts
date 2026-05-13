'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchActivityAvailableSchedule } from '@/app/(main)/activity/[id]/apis/activityAvailableSchedule';
import type {
  CalendarValue,
  MobileSheetStep,
  TimeSlot,
} from '@/app/(main)/activity/[id]/components/activity-reservation-card/activityReservationCard.types';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';
import type { ActivitySchedule } from '@/shared/types/activityDetail.types';
import { formatDateKey } from '@/shared/utils/formatDate';

interface UseActivityReservationCardStateProps {
  activityId: number;
  pricePerPerson: number;
  schedules: ActivitySchedule[];
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

export const useActivityReservationCardState = ({
  activityId,
  pricePerPerson,
  schedules,
}: UseActivityReservationCardStateProps) => {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [headCount, setHeadCount] = useState(1);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false);
  const [mobileSheetStep, setMobileSheetStep] =
    useState<MobileSheetStep>('dateTime');

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

  const fallbackScheduleByDate = useMemo(() => {
    return schedules.reduce<Record<string, TimeSlot[]>>(
      (accumulator, schedule) => {
        const dateKey = normalizeDateKey(schedule.date);
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
  }, [schedules]);

  const availableScheduleByDate = useMemo(() => {
    const fromAvailableApi = availableSchedules.reduce<
      Record<string, (typeof availableSchedules)[number]['times']>
    >((accumulator, item) => {
      const dateKey = normalizeDateKey(item.date);
      accumulator[dateKey] = item.times;
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
    fallbackScheduleByDate,
    isAvailableSchedulesError,
    isAvailableSchedulesLoading,
  ]);

  const availableDateKeys = useMemo(
    () => Object.keys(availableScheduleByDate).sort(),
    [availableScheduleByDate]
  );

  const hasSelectableDate = availableDateKeys.length > 0;
  const effectiveSelectedDateKey =
    selectedDateKey ?? availableDateKeys[0] ?? null;

  const parsedSelectedDate = useMemo(() => {
    if (!effectiveSelectedDateKey) {
      return null;
    }

    const [year, month, day] = effectiveSelectedDateKey.split('-').map(Number);
    return new Date(year, month - 1, day);
  }, [effectiveSelectedDateKey]);

  const selectedDate = useMemo(() => {
    if (parsedSelectedDate) {
      return parsedSelectedDate;
    }
    return new Date();
  }, [parsedSelectedDate]);

  const availableTimeSlots = useMemo<TimeSlot[]>(() => {
    if (!effectiveSelectedDateKey) {
      return [];
    }

    return availableScheduleByDate[effectiveSelectedDateKey] ?? [];
  }, [availableScheduleByDate, effectiveSelectedDateKey]);

  const activeSelectedTimeSlot = useMemo(() => {
    if (availableTimeSlots.length === 0) {
      return null;
    }

    if (!selectedTimeSlot) {
      return availableTimeSlots[0];
    }

    return (
      availableTimeSlots.find((slot) => slot.id === selectedTimeSlot.id) ??
      availableTimeSlots[0]
    );
  }, [availableTimeSlots, selectedTimeSlot]);

  const displayCurrentDate = currentDate ?? selectedDate;
  const monthTitle = useMemo(
    () =>
      `${displayCurrentDate.getFullYear()}년 ${displayCurrentDate.getMonth() + 1}월`,
    [displayCurrentDate]
  );

  const totalPrice = useMemo(
    () => pricePerPerson * headCount,
    [headCount, pricePerPerson]
  );

  const selectedDateText = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  }, [selectedDate]);

  const handleOpenDateSheet = () => {
    setMobileSheetStep('dateTime');
    if (parsedSelectedDate) {
      setCurrentDate(
        new Date(
          parsedSelectedDate.getFullYear(),
          parsedSelectedDate.getMonth(),
          1
        )
      );
    }
    setIsDateSheetOpen(true);
  };

  const handleCloseDateSheet = () => {
    setIsDateSheetOpen(false);
  };

  const handleMoveToHeadCountStep = () => {
    setMobileSheetStep('headCount');
  };

  const handleMoveToDateTimeStep = () => {
    setMobileSheetStep('dateTime');
  };

  const handleDecreaseHeadCount = () => {
    setHeadCount((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseHeadCount = () => {
    setHeadCount((prev) => prev + 1);
  };

  const handleSelectTimeSlot = (slot: TimeSlot) => () => {
    setSelectedTimeSlot(slot);
  };

  const handleDateChange = (value: CalendarValue) => {
    if (value instanceof Date) {
      const newDateKey = formatDateKey(value);

      if (newDateKey === selectedDateKey) {
        return;
      }

      setSelectedDateKey(newDateKey);
      setCurrentDate(new Date(value.getFullYear(), value.getMonth(), 1));
      setSelectedTimeSlot(null);
    }
  };

  const handleMonthChange = (activeStartDate?: Date | null) => {
    if (activeStartDate) {
      setCurrentDate(activeStartDate);
    }
  };

  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') {
      return false;
    }

    const dateKey = formatDateKey(date);
    return !Boolean(availableScheduleByDate[dateKey]);
  };

  return {
    isDateSheetOpen,
    mobileSheetStep,
    hasSelectableDate,
    selectedDate,
    displayCurrentDate,
    monthTitle,
    selectedDateText,
    activeSelectedTimeSlot,
    availableTimeSlots,
    headCount,
    totalPrice,
    handleOpenDateSheet,
    handleCloseDateSheet,
    handleMoveToHeadCountStep,
    handleMoveToDateTimeStep,
    handleDateChange,
    handleMonthChange,
    handleSelectTimeSlot,
    handleDecreaseHeadCount,
    handleIncreaseHeadCount,
    tileDisabled,
  };
};
