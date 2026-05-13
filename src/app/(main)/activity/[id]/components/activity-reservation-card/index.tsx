'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchActivityAvailableSchedule } from '@/app/(main)/activity/[id]/apis/activityAvailableSchedule';
import type {
  CalendarValue,
  MobileSheetStep,
  TimeSlot,
} from '@/app/(main)/activity/[id]/components/activity-reservation-card/activityReservationCard.types';
import { DesktopReservationCard } from '@/app/(main)/activity/[id]/components/activity-reservation-card/components/desktopReservationCard';
import { MobileReservationBottomBar } from '@/app/(main)/activity/[id]/components/activity-reservation-card/components/mobileReservationBottomBar';
import { MobileReservationSheet } from '@/app/(main)/activity/[id]/components/activity-reservation-card/components/mobileReservationSheet';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';
import type { ActivitySchedule } from '@/shared/types/activityDetail.types';
import { formatDateKey } from '@/shared/utils/formatDate';
import '@/app/(main)/activity/[id]/components/activity-reservation-card/reservation-calendar.css';

/**
 * @description
 * 체험 상세 예약 카드/바텀시트 컴포넌트
 * - PC: 우측 고정 예약 카드 렌더링
 * - 모바일/태블릿: 하단 고정 바 + 날짜 선택 바텀시트 렌더링
 */
interface ActivityReservationCardProps {
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

export function ActivityReservationCard({
  activityId,
  pricePerPerson,
  schedules,
}: ActivityReservationCardProps) {
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

    // available-schedule 조회 실패/빈 값/로딩 중에는 상세 schedules를 fallback으로 사용
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

  const selectedDateTimeSlots = useMemo<TimeSlot[]>(() => {
    if (!effectiveSelectedDateKey) {
      return [];
    }

    return availableScheduleByDate[effectiveSelectedDateKey] ?? [];
  }, [availableScheduleByDate, effectiveSelectedDateKey]);

  const availableTimeSlots = selectedDateTimeSlots;

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

  /**
   * @description 바텀시트에서 선택한 날짜를 `yyyy.mm.dd` 형식으로 변환
   */
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

  /**
   * @description 날짜 선택 바텀시트 close
   */
  const handleCloseDateSheet = () => {
    setIsDateSheetOpen(false);
  };

  /**
   * @description 모바일 바텀시트 단계를 인원 선택으로 이동
   */
  const handleMoveToHeadCountStep = () => {
    setMobileSheetStep('headCount');
  };

  /**
   * @description 모바일 바텀시트 단계를 날짜/시간 선택으로 되돌림
   */
  const handleMoveToDateTimeStep = () => {
    setMobileSheetStep('dateTime');
  };

  /**
   * @description 참여 인원을 1명 이상으로 감소
   */
  const handleDecreaseHeadCount = () => {
    setHeadCount((prev) => Math.max(1, prev - 1));
  };

  /**
   * @description 참여 인원을 증가
   */
  const handleIncreaseHeadCount = () => {
    setHeadCount((prev) => prev + 1);
  };

  /**
   * @description 시간 슬롯 선택 핸들러를 반환
   */
  const handleSelectTimeSlot = (slot: TimeSlot) => () => {
    setSelectedTimeSlot(slot);
  };

  /**
   * @description 캘린더 값이 `Date`인 경우에만 선택 날짜 반영
   */
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

  /**
   * @description 캘린더의 현재 월 갱신
   */
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

  return (
    <>
      <MobileReservationBottomBar
        pricePerPerson={pricePerPerson}
        onOpenDateSheet={handleOpenDateSheet}
      />
      <MobileReservationSheet
        isOpen={isDateSheetOpen}
        mobileSheetStep={mobileSheetStep}
        hasSelectableDate={hasSelectableDate}
        selectedDate={selectedDate}
        currentDate={displayCurrentDate}
        monthTitle={monthTitle}
        selectedDateText={selectedDateText}
        selectedTimeSlot={activeSelectedTimeSlot}
        availableTimeSlots={availableTimeSlots}
        headCount={headCount}
        totalPrice={totalPrice}
        onClose={handleCloseDateSheet}
        onMoveToHeadCountStep={handleMoveToHeadCountStep}
        onMoveToDateTimeStep={handleMoveToDateTimeStep}
        onDateChange={handleDateChange}
        onMonthChange={handleMonthChange}
        onSelectTimeSlot={handleSelectTimeSlot}
        onDecreaseHeadCount={handleDecreaseHeadCount}
        onIncreaseHeadCount={handleIncreaseHeadCount}
        tileDisabled={tileDisabled}
      />

      <DesktopReservationCard
        pricePerPerson={pricePerPerson}
        selectedDate={selectedDate}
        currentDate={displayCurrentDate}
        monthTitle={monthTitle}
        headCount={headCount}
        totalPrice={totalPrice}
        selectedTimeSlot={activeSelectedTimeSlot}
        availableTimeSlots={availableTimeSlots}
        hasSelectableDate={hasSelectableDate}
        onDateChange={handleDateChange}
        onMonthChange={handleMonthChange}
        onDecreaseHeadCount={handleDecreaseHeadCount}
        onIncreaseHeadCount={handleIncreaseHeadCount}
        onSelectTimeSlot={handleSelectTimeSlot}
        tileDisabled={tileDisabled}
      />
    </>
  );
}
