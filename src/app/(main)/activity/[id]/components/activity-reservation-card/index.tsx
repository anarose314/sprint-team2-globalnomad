'use client';

import { useMemo, useState } from 'react';
import { MOCK_PRICE_PER_PERSON } from '@/app/(main)/activity/[id]/components/activity-reservation-card/activityReservationCard.constants';
import type {
  CalendarValue,
  MobileSheetStep,
  TimeSlot,
} from '@/app/(main)/activity/[id]/components/activity-reservation-card/activityReservationCard.types';
import { DesktopReservationCard } from '@/app/(main)/activity/[id]/components/activity-reservation-card/components/desktopReservationCard';
import { MobileReservationBottomBar } from '@/app/(main)/activity/[id]/components/activity-reservation-card/components/mobileReservationBottomBar';
import { MobileReservationSheet } from '@/app/(main)/activity/[id]/components/activity-reservation-card/components/mobileReservationSheet';
import '@/app/(main)/activity/[id]/components/activity-reservation-card/reservation-calendar.css';

/**
 * @description
 * 체험 상세 예약 카드/바텀시트 컴포넌트
 * - PC: 우측 고정 예약 카드 렌더링
 * - 모바일/태블릿: 하단 고정 바 + 날짜 선택 바텀시트 렌더링
 */
export function ActivityReservationCard() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [headCount, setHeadCount] = useState(1);
  const [selectedTimeSlot, setSelectedTimeSlot] =
    useState<TimeSlot>('15:00-16:00');
  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false);
  const [mobileSheetStep, setMobileSheetStep] =
    useState<MobileSheetStep>('dateTime');

  const monthTitle = useMemo(
    () => `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`,
    [currentDate]
  );

  const totalPrice = useMemo(
    () => MOCK_PRICE_PER_PERSON * headCount,
    [headCount]
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
      setSelectedDate(value);
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

  return (
    <>
      <MobileReservationBottomBar onOpenDateSheet={handleOpenDateSheet} />
      <MobileReservationSheet
        isOpen={isDateSheetOpen}
        mobileSheetStep={mobileSheetStep}
        selectedDate={selectedDate}
        currentDate={currentDate}
        monthTitle={monthTitle}
        selectedDateText={selectedDateText}
        selectedTimeSlot={selectedTimeSlot}
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
      />

      <DesktopReservationCard
        selectedDate={selectedDate}
        currentDate={currentDate}
        monthTitle={monthTitle}
        headCount={headCount}
        totalPrice={totalPrice}
        selectedTimeSlot={selectedTimeSlot}
        onDateChange={handleDateChange}
        onMonthChange={handleMonthChange}
        onDecreaseHeadCount={handleDecreaseHeadCount}
        onIncreaseHeadCount={handleIncreaseHeadCount}
        onSelectTimeSlot={handleSelectTimeSlot}
      />
    </>
  );
}
