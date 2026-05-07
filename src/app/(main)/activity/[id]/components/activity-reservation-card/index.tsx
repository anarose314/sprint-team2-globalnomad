'use client';

import { useMemo, useState } from 'react';
import Calendar from 'react-calendar';
import { TimeSlotButton } from '@/app/(main)/activity/[id]/components/time-slot-button';
import { WEEKDAY } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.constants';
import {
  IcArrowLeft,
  IcArrowRight,
  IcMinus,
  IcPlus,
} from '@/shared/assets/icons';
import { Button } from '@/shared/components/buttons/button';
import '@/app/(main)/activity/[id]/components/activity-reservation-card/reservation-calendar.css';

const MOCK_PRICE_PER_PERSON = 1000;
const MOCK_TIME_SLOTS = ['14:00-15:00', '15:00-16:00', '16:00-17:00'] as const;

export function ActivityReservationCard() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [headCount, setHeadCount] = useState(10);
  const [selectedTimeSlot, setSelectedTimeSlot] =
    useState<(typeof MOCK_TIME_SLOTS)[number]>('15:00-16:00');
  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false);
  const [sheetCurrentDate, setSheetCurrentDate] = useState(() => new Date());
  const [sheetSelectedDate, setSheetSelectedDate] = useState<Date | null>(null);
  const [sheetHeadCount, setSheetHeadCount] = useState(10);
  const [sheetSelectedTimeSlot, setSheetSelectedTimeSlot] =
    useState<(typeof MOCK_TIME_SLOTS)[number]>('15:00-16:00');

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

  return (
    <>
      <aside className="z-header fixed inset-x-0 bottom-0 h-[138px] border-t border-gray-100 bg-white md:h-[132px] 2xl:hidden">
        <div className="mx-auto flex h-full w-full items-end justify-center px-4 pb-5 md:px-6 md:pb-4">
          <div className="flex w-full flex-col items-center gap-4 md:gap-3">
            <div className="flex items-end">
              <span className="typo-2lg-bold text-gray-950">₩1,000</span>
              <span className="typo-lg-medium ml-1 text-gray-600">/ 인</span>
            </div>
            <Button
              size="lg"
              className="w-full"
              onClick={() => setIsDateSheetOpen(true)}
            >
              날짜 선택하기
            </Button>
          </div>
        </div>
      </aside>

      {isDateSheetOpen ? (
        <div
          className="z-modal-backdrop animate-reservation-sheet-backdrop-in fixed inset-0 bg-black/60 2xl:hidden"
          onClick={() => setIsDateSheetOpen(false)}
        >
          <section
            className="animate-reservation-sheet-in absolute right-0 bottom-0 left-0 w-full rounded-t-2xl bg-white px-5 pt-14 pb-5 shadow-[0px_4px_24px_0px_#9CB4CA33] md:pt-7 md:pb-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto flex w-full max-w-[744px] flex-col">
              <div className="md:grid md:grid-cols-[359px_301px] md:items-start md:justify-center md:gap-6">
                <div className="w-full md:mt-4 md:w-[359px]">
                  <Calendar
                    value={sheetSelectedDate ?? new Date()}
                    onChange={(value) => setSheetSelectedDate(value as Date)}
                    onClickDay={(value) => setSheetSelectedDate(value as Date)}
                    activeStartDate={sheetCurrentDate}
                    onActiveStartDateChange={({ activeStartDate }) => {
                      if (activeStartDate) setSheetCurrentDate(activeStartDate);
                    }}
                    showNeighboringMonth
                    locale="ko-KR"
                    calendarType="gregory"
                    prevLabel={
                      <span className="inline-flex h-6 w-6 items-center justify-center text-gray-950">
                        <IcArrowLeft className="h-5 w-5" />
                      </span>
                    }
                    nextLabel={
                      <span className="inline-flex h-6 w-6 items-center justify-center text-gray-950">
                        <IcArrowRight className="h-5 w-5" />
                      </span>
                    }
                    prev2Label={null}
                    next2Label={null}
                    formatMonthYear={() => sheetMonthTitle}
                    formatShortWeekday={(_, date) => WEEKDAY[date.getDay()]}
                    formatDay={(_, date) => String(date.getDate())}
                    className="activity-booking-calendar activity-booking-sheet-calendar"
                  />
                </div>

                <div className="mt-4 h-auto rounded-3xl bg-white p-5 shadow-[0px_4px_24px_0px_#9CB4CA33] md:mt-0 md:h-[408px] md:w-[301px] md:overflow-y-auto md:overscroll-contain">
                  <p className="typo-lg-bold text-gray-950">예약 가능한 시간</p>
                  {sheetSelectedDate ? (
                    <>
                      <div className="mt-3 flex flex-col gap-3">
                        {MOCK_TIME_SLOTS.map((slot) => (
                          <TimeSlotButton
                            key={slot}
                            size="tb"
                            isActive={sheetSelectedTimeSlot === slot}
                            onClick={() => setSheetSelectedTimeSlot(slot)}
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
                            onClick={() =>
                              setSheetHeadCount((prev) => Math.max(1, prev - 1))
                            }
                            className="inline-flex h-6 w-6 items-center justify-center text-gray-800"
                          >
                            <IcMinus className="h-4 w-4" />
                          </button>
                          <span className="typo-2lg-bold text-gray-800">
                            {sheetHeadCount}
                          </span>
                          <button
                            type="button"
                            aria-label="인원 증가"
                            onClick={() =>
                              setSheetHeadCount((prev) => prev + 1)
                            }
                            className="inline-flex h-6 w-6 items-center justify-center text-gray-800"
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
              <Button size="lg" className="mt-6 w-full md:mt-6">
                {new Intl.NumberFormat('ko-KR').format(sheetTotalPrice)}원
                예약하기
              </Button>
            </div>
          </section>
        </div>
      ) : null}

      <aside className="hidden w-full 2xl:block">
        <div className="mx-auto w-full max-w-[410px] overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0px_4px_24px_0px_#9CB4CA33]">
          <div className="max-h-[calc(100vh-120px)] overflow-y-auto overscroll-contain p-[30px]">
            <div className="mx-auto w-[350px]">
              <div className="flex items-end">
                <span className="typo-2xl-bold text-gray-950">₩1,000</span>
                <span className="typo-xl-medium ml-1 text-gray-600">/ 인</span>
              </div>

              <div className="mt-6">
                <Calendar
                  value={selectedDate}
                  onChange={(value) => setSelectedDate(value as Date)}
                  activeStartDate={currentDate}
                  onActiveStartDateChange={({ activeStartDate }) => {
                    if (activeStartDate) setCurrentDate(activeStartDate);
                  }}
                  showNeighboringMonth
                  locale="ko-KR"
                  calendarType="gregory"
                  prevLabel={
                    <span className="inline-flex h-6 w-6 items-center justify-center text-gray-950">
                      <IcArrowLeft className="h-5 w-5" />
                    </span>
                  }
                  nextLabel={
                    <span className="inline-flex h-6 w-6 items-center justify-center text-gray-950">
                      <IcArrowRight className="h-5 w-5" />
                    </span>
                  }
                  prev2Label={null}
                  next2Label={null}
                  formatMonthYear={() => monthTitle}
                  formatShortWeekday={(_, date) => WEEKDAY[date.getDay()]}
                  formatDay={(_, date) => String(date.getDate())}
                  className="activity-booking-calendar"
                />
              </div>

              <div className="mt-6 flex h-10 items-center justify-between">
                <span className="typo-lg-bold text-gray-950">참여 인원 수</span>
                <div className="flex h-10 w-[140px] items-center justify-between rounded-3xl border border-gray-200 px-[9px]">
                  <button
                    type="button"
                    aria-label="인원 감소"
                    onClick={() =>
                      setHeadCount((prev) => Math.max(1, prev - 1))
                    }
                    className="inline-flex h-6 w-6 items-center justify-center text-gray-800"
                  >
                    <IcMinus className="h-4 w-4" />
                  </button>
                  <span className="typo-lg-bold text-gray-800">
                    {headCount}
                  </span>
                  <button
                    type="button"
                    aria-label="인원 증가"
                    onClick={() => setHeadCount((prev) => prev + 1)}
                    className="inline-flex h-6 w-6 items-center justify-center text-gray-800"
                  >
                    <IcPlus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <p className="typo-lg-bold text-gray-950">예약 가능한 시간</p>
                <div className="mt-[14px] mb-6 flex flex-col gap-3">
                  {MOCK_TIME_SLOTS.map((slot) => (
                    <TimeSlotButton
                      key={slot}
                      size="pc"
                      isActive={selectedTimeSlot === slot}
                      onClick={() => setSelectedTimeSlot(slot)}
                    >
                      {slot}
                    </TimeSlotButton>
                  ))}
                </div>
              </div>

              <div className="flex h-[78px] items-center justify-between border-t border-gray-100">
                <div className="flex items-end gap-1">
                  <span className="typo-xl-medium text-gray-600">총 합계</span>
                  <span className="typo-xl-bold text-gray-950">
                    {new Intl.NumberFormat('ko-KR').format(totalPrice)}원
                  </span>
                </div>
                <Button size="sm" className="w-[120px]">
                  예약하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
