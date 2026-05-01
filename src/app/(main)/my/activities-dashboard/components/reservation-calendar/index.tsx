'use client';

<<<<<<< HEAD
import { useEffect, useMemo, useState } from 'react';
=======
import { useMemo, useState } from 'react';
>>>>>>> a863ace (✨ Feat: 이벤트 배지 컴포넌트 구현 및 캘린더 UI 마크업)
import Calendar from 'react-calendar';
import { ReservationCalendarDayTile } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/reservationCalendarDayTile';
import {
  EVENT_COUNTS_BY_DATE,
  WEEKDAY,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.constants';
import { ReservationEventCounts } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import { IcArrowLeft, IcArrowRight } from '@/shared/assets/icons';
import '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservation-calendar.css';

/**
<<<<<<< HEAD
 * Date 객체를 예약 캘린더 이벤트 맵에서 사용하는 yyyy-mm-dd 키로 변환
=======
 * Date 객체를 예약 캘린더 이벤트 맵에서 사용하는 yyyy-mm-dd 키로 변환합니다.
>>>>>>> a863ace (✨ Feat: 이벤트 배지 컴포넌트 구현 및 캘린더 UI 마크업)
 */
function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
<<<<<<< HEAD
 * 예약 현황 페이지에서 월 단위 예약 상태를 보여주는 캘린더 컴포넌트
 * 날짜별 예약/승인/완료 배지를 표시
 */
export function ReservationCalendar() {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const now = new Date();
      setCurrentDate(now);
      setSelectedDate(now);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const currentMonthTitle = useMemo(
    () =>
      currentDate
        ? `${currentDate.getFullYear()}년 ${String(currentDate.getMonth() + 1).padStart(2, '0')}월`
        : '',
    [currentDate]
  );

  if (!currentDate || !selectedDate) {
    return null;
  }

=======
 * 예약 현황 페이지에서 월 단위 예약 상태를 보여주는 캘린더 컴포넌트입니다.
 * 날짜별 예약/승인/완료 배지를 표시하며, 월 이동 상태를 내부에서 관리합니다.
 */
export function ReservationCalendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const currentMonthTitle = useMemo(
    () =>
      `${currentDate.getFullYear()}년 ${String(currentDate.getMonth() + 1).padStart(2, '0')}월`,
    [currentDate]
  );

>>>>>>> a863ace (✨ Feat: 이벤트 배지 컴포넌트 구현 및 캘린더 UI 마크업)
  return (
    <div className="mt-7 w-full md:mt-6">
      <Calendar
        value={selectedDate}
        onChange={(value) => setSelectedDate(value as Date)}
        activeStartDate={currentDate}
        onActiveStartDateChange={({ activeStartDate }) => {
          if (activeStartDate) setCurrentDate(activeStartDate);
        }}
        showNeighboringMonth
        prevLabel={
          <span className="inline-flex h-6 w-6 items-center justify-center text-gray-950">
            <IcArrowLeft className="h-6 w-6" />
          </span>
        }
        nextLabel={
          <span className="inline-flex h-6 w-6 items-center justify-center text-gray-950">
            <IcArrowRight className="h-6 w-6" />
          </span>
        }
        prev2Label={null}
        next2Label={null}
        formatMonthYear={() => currentMonthTitle}
        formatShortWeekday={(_, date) => WEEKDAY[date.getDay()]}
        formatDay={() => ''}
<<<<<<< HEAD
        locale="ko-KR"
=======
        locale="en-US"
>>>>>>> a863ace (✨ Feat: 이벤트 배지 컴포넌트 구현 및 캘린더 UI 마크업)
        calendarType="gregory"
        className="reservation-calendar"
        tileClassName={({ view }) => {
          if (view !== 'month') return undefined;
          return 'reservation-calendar__day-tile';
        }}
        tileContent={({ date, view, activeStartDate }) => {
          if (view !== 'month') return null;

          const visibleMonthDate = activeStartDate ?? currentDate;
          const isCurrentMonth =
            date.getMonth() === visibleMonthDate.getMonth() &&
            date.getFullYear() === visibleMonthDate.getFullYear();
          const eventCounts: ReservationEventCounts | undefined =
            EVENT_COUNTS_BY_DATE[toDateKey(date)];

          return (
            <ReservationCalendarDayTile
              date={date}
              isCurrentMonth={isCurrentMonth}
              eventCounts={eventCounts}
            />
          );
        }}
      />
    </div>
  );
}
