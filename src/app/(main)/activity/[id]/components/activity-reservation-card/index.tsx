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

  const monthTitle = useMemo(
    () => `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`,
    [currentDate]
  );

  const totalPrice = useMemo(
    () => MOCK_PRICE_PER_PERSON * headCount,
    [headCount]
  );

  return (
    <aside className="hidden w-full 2xl:sticky 2xl:top-10 2xl:flex 2xl:justify-center">
      <div className="w-full max-w-[410px] rounded-3xl border border-gray-100 bg-white p-[30px] shadow-[0px_4px_24px_0px_#9CB4CA33]">
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
                onClick={() => setHeadCount((prev) => Math.max(1, prev - 1))}
                className="inline-flex h-6 w-6 items-center justify-center text-gray-800"
              >
                <IcMinus className="h-4 w-4" />
              </button>
              <span className="typo-lg-bold text-gray-800">{headCount}</span>
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
    </aside>
  );
}
