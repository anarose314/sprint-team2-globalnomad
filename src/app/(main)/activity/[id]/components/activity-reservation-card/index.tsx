'use client';

import { useMemo, useState } from 'react';
import {
  MOCK_PRICE_PER_PERSON,
  MOCK_TIME_SLOTS,
} from '@/app/(main)/activity/[id]/components/activity-reservation-card/activityReservationCard.constants';
import type {
  CalendarValue,
  MobileSheetStep,
  TimeSlot,
} from '@/app/(main)/activity/[id]/components/activity-reservation-card/activityReservationCard.types';
import { DesktopReservationCard } from '@/app/(main)/activity/[id]/components/activity-reservation-card/components/desktopReservationCard';
import { MobileReservationBottomBar } from '@/app/(main)/activity/[id]/components/activity-reservation-card/components/mobileReservationBottomBar';
import { ReservationCalendarView } from '@/app/(main)/activity/[id]/components/activity-reservation-card/components/reservationCalendarView';
import { TimeSlotButton } from '@/app/(main)/activity/[id]/components/time-slot-button';
import { IcArrowLeft, IcMinus, IcPlus } from '@/shared/assets/icons';
import { Button } from '@/shared/components/buttons/button';
import { Heading } from '@/shared/components/heading';
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
  const [headCount, setHeadCount] = useState(10);
  const [selectedTimeSlot, setSelectedTimeSlot] =
    useState<TimeSlot>('15:00-16:00');
  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false);
  const [mobileSheetStep, setMobileSheetStep] =
    useState<MobileSheetStep>('dateTime');
  const [sheetCurrentDate, setSheetCurrentDate] = useState(() => new Date());
  const [sheetSelectedDate, setSheetSelectedDate] = useState<Date | null>(null);
  const [sheetHeadCount, setSheetHeadCount] = useState(10);
  const [sheetSelectedTimeSlot, setSheetSelectedTimeSlot] =
    useState<TimeSlot | null>(null);

  const monthTitle = useMemo(
    () => `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`,
    [currentDate]
  );
  const sheetMonthTitle = useMemo(
    () =>
      `${sheetCurrentDate.getFullYear()}년 ${sheetCurrentDate.getMonth() + 1}월`,
    [sheetCurrentDate]
  );

  const totalPrice = useMemo(
    () => MOCK_PRICE_PER_PERSON * headCount,
    [headCount]
  );
  const sheetTotalPrice = useMemo(
    () => MOCK_PRICE_PER_PERSON * sheetHeadCount,
    [sheetHeadCount]
  );

  /**
   * @description 바텀시트에서 선택한 날짜를 `yyyy.mm.dd` 형식으로 변환
   */
  const selectedSheetDateText = useMemo(() => {
    if (!sheetSelectedDate) return '';
    const year = sheetSelectedDate.getFullYear();
    const month = String(sheetSelectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(sheetSelectedDate.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  }, [sheetSelectedDate]);

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
   * @description 바텀시트 내부 클릭 시 오버레이 클릭 이벤트 전파를 막음
   */
  const handleStopPropagation = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
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
   * @description 바텀시트 참여 인원을 1명 이상으로 감소
   */
  const handleDecreaseSheetHeadCount = () => {
    setSheetHeadCount((prev) => Math.max(1, prev - 1));
  };

  /**
   * @description 바텀시트 참여 인원을 증가
   */
  const handleIncreaseSheetHeadCount = () => {
    setSheetHeadCount((prev) => prev + 1);
  };

  /**
   * @description PC 카드 참여 인원을 1명 이상으로 감소
   */
  const handleDecreaseHeadCount = () => {
    setHeadCount((prev) => Math.max(1, prev - 1));
  };

  /**
   * @description PC 카드 참여 인원 증가
   */
  const handleIncreaseHeadCount = () => {
    setHeadCount((prev) => prev + 1);
  };

  /**
   * @description 바텀시트 시간 슬롯 선택 핸들러를 반환
   */
  const handleSelectSheetTimeSlot = (slot: TimeSlot) => () => {
    setSheetSelectedTimeSlot(slot);
  };

  /**
   * @description PC 카드 시간 슬롯 선택 핸들러를 반환
   */
  const handleSelectTimeSlot = (slot: TimeSlot) => () => {
    setSelectedTimeSlot(slot);
  };

  /**
   * @description 캘린더 값이 `Date`인 경우에만 바텀시트 선택 날짜 반영
   */
  const handleSheetDateChange = (value: CalendarValue) => {
    if (value instanceof Date) {
      setSheetSelectedDate(value);
    }
  };

  /**
   * @description 바텀시트 캘린더의 현재 월 갱신
   */
  const handleSheetMonthChange = (activeStartDate?: Date | null) => {
    if (activeStartDate) {
      setSheetCurrentDate(activeStartDate);
    }
  };

  /**
   * @description 캘린더 값이 `Date`인 경우에만 PC 카드 선택 날짜 반영
   */
  const handleDateChange = (value: CalendarValue) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  /**
   * @description PC 카드 캘린더의 현재 월 갱신
   */
  const handleMonthChange = (activeStartDate?: Date | null) => {
    if (activeStartDate) {
      setCurrentDate(activeStartDate);
    }
  };

  return (
    <>
      <MobileReservationBottomBar onOpenDateSheet={handleOpenDateSheet} />

      {isDateSheetOpen ? (
        <div
          className="z-modal-backdrop animate-reservation-sheet-backdrop-in fixed inset-0 bg-black/60 2xl:hidden"
          onClick={handleCloseDateSheet}
        >
          <section
            className="animate-reservation-sheet-in shadow-review-card absolute right-0 bottom-0 left-0 w-full rounded-t-2xl bg-white px-5 pt-14 pb-5 md:pt-7 md:pb-5"
            onClick={handleStopPropagation}
          >
            <div className="mx-auto w-full max-w-186">
              <div className="md:hidden">
                {mobileSheetStep === 'dateTime' ? (
                  <>
                    <ReservationCalendarView
                      value={sheetSelectedDate ?? new Date()}
                      activeStartDate={sheetCurrentDate}
                      monthTitle={sheetMonthTitle}
                      onDateChange={handleSheetDateChange}
                      onMonthChange={handleSheetMonthChange}
                      className="activity-booking-calendar activity-booking-sheet-calendar"
                    />

                    {sheetSelectedDate ? (
                      <div className="mt-6">
                        <p className="typo-lg-bold text-gray-950">
                          예약 가능한 시간
                        </p>
                        <div className="mt-3 flex flex-col gap-3">
                          {MOCK_TIME_SLOTS.map((slot) => (
                            <TimeSlotButton
                              key={slot}
                              size="tb"
                              isActive={sheetSelectedTimeSlot === slot}
                              onClick={handleSelectSheetTimeSlot(slot)}
                              className="w-full"
                            >
                              {slot}
                            </TimeSlotButton>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <Button
                      size="lg"
                      className="mt-6 w-full"
                      disabled={!sheetSelectedDate || !sheetSelectedTimeSlot}
                      onClick={handleMoveToHeadCountStep}
                    >
                      확인
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="mb-5 flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="날짜 및 시간 선택 단계로 돌아가기"
                        onClick={handleMoveToDateTimeStep}
                        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center text-gray-950"
                      >
                        <IcArrowLeft className="h-5 w-5" />
                      </button>
                      <Heading as="h3" textStyle="typo-2lg-bold">
                        인원
                      </Heading>
                    </div>

                    <p className="typo-lg-medium mb-3.5 text-gray-800">
                      예약할 인원을 선택해주세요.
                    </p>

                    <div className="bg-primary-50 mb-5 flex items-center justify-between rounded-xl px-6 py-4">
                      <span className="typo-md-bold text-gray-950">
                        {selectedSheetDateText}
                      </span>
                      <span className="typo-xs-medium text-gray-400">
                        {sheetSelectedTimeSlot ?? '-'}
                      </span>
                    </div>

                    <div className="mb-8 flex items-center justify-between">
                      <p className="typo-lg-bold text-gray-950">참여 인원 수</p>
                      <div className="flex h-12 w-36 items-center justify-between rounded-2xl border border-gray-100 px-4">
                        <button
                          type="button"
                          aria-label="인원 감소"
                          onClick={handleDecreaseSheetHeadCount}
                          className="inline-flex h-6 w-6 cursor-pointer items-center justify-center text-gray-800"
                        >
                          <IcMinus className="h-4 w-4" />
                        </button>
                        <span className="typo-lg-bold text-gray-800">
                          {sheetHeadCount}
                        </span>
                        <button
                          type="button"
                          aria-label="인원 증가"
                          onClick={handleIncreaseSheetHeadCount}
                          className="inline-flex h-6 w-6 cursor-pointer items-center justify-center text-gray-800"
                        >
                          <IcPlus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <Button size="lg" className="w-full">
                      {new Intl.NumberFormat('ko-KR').format(sheetTotalPrice)}원
                      예약하기
                    </Button>
                  </>
                )}
              </div>

              <div className="hidden md:block">
                <div className="flex items-start justify-center gap-6">
                  <div className="w-90">
                    <ReservationCalendarView
                      value={sheetSelectedDate ?? new Date()}
                      activeStartDate={sheetCurrentDate}
                      monthTitle={sheetMonthTitle}
                      onDateChange={handleSheetDateChange}
                      onMonthChange={handleSheetMonthChange}
                      className="activity-booking-calendar activity-booking-sheet-calendar"
                    />
                  </div>

                  <div className="shadow-review-card h-102 w-75 overflow-y-auto overscroll-contain rounded-3xl bg-white p-5">
                    <p className="typo-lg-bold text-gray-950">
                      예약 가능한 시간
                    </p>
                    {sheetSelectedDate ? (
                      <>
                        <div className="mt-3 flex flex-col gap-3">
                          {MOCK_TIME_SLOTS.map((slot) => (
                            <TimeSlotButton
                              key={slot}
                              size="tb"
                              isActive={sheetSelectedTimeSlot === slot}
                              onClick={handleSelectSheetTimeSlot(slot)}
                              className="w-full"
                            >
                              {slot}
                            </TimeSlotButton>
                          ))}
                        </div>
                        <div className="mt-7">
                          <p className="typo-lg-bold text-gray-950">
                            참여 인원 수
                          </p>
                          <div className="mt-3 flex h-12 w-full items-center justify-between rounded-2xl border border-gray-200 px-5">
                            <button
                              type="button"
                              aria-label="인원 감소"
                              onClick={handleDecreaseSheetHeadCount}
                              className="inline-flex h-6 w-6 cursor-pointer items-center justify-center text-gray-800"
                            >
                              <IcMinus className="h-4 w-4" />
                            </button>
                            <span className="typo-2lg-bold text-gray-800">
                              {sheetHeadCount}
                            </span>
                            <button
                              type="button"
                              aria-label="인원 증가"
                              onClick={handleIncreaseSheetHeadCount}
                              className="inline-flex h-6 w-6 cursor-pointer items-center justify-center text-gray-800"
                            >
                              <IcPlus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="typo-lg-medium mt-24 text-center text-gray-500">
                        날짜를 선택해주세요.
                      </p>
                    )}
                  </div>
                </div>

                <Button size="lg" className="mt-6 w-full">
                  {new Intl.NumberFormat('ko-KR').format(sheetTotalPrice)}원
                  예약하기
                </Button>
              </div>
            </div>
          </section>
        </div>
      ) : null}

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
