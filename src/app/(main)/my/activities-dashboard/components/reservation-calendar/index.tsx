'use client';

import { useMemo, useRef, useState } from 'react';
import Calendar from 'react-calendar';
import { ReservationCalendarDayTile } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/reservationCalendarDayTile';
import { ReservationDetailSheet } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/reservationDetailSheet';
import { useDesktopSheetPosition } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/hooks/useDesktopSheetPosition';
import {
  EVENT_COUNTS_BY_DATE,
  RESERVATION_DETAIL_BY_DATE,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.constants';
import { ReservationEventCounts } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import { IcArrowLeft, IcArrowRight } from '@/shared/assets/icons';
import { WEEKDAY } from '@/shared/constants/calendar.constants';
import { cn } from '@/shared/utils/cn';
import { formatDateKey } from '@/shared/utils/formatDate';
import '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservation-calendar.css';

/**
 * 예약 현황 페이지의 월간 예약 캘린더
 *
 * - 날짜별 상태 배지(예약/승인/완료) 렌더링
 * - 날짜 클릭 시 상세 패널(바텀시트/플로팅) 오픈
 * - 대형 화면에서는 클릭 타일 기준으로 상세 패널 위치 자동 보정
 */
export function ReservationCalendar() {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [detailDate, setDetailDate] = useState<Date | null>(null);
  const calendarRootRef = useRef<HTMLDivElement>(null);

  const currentMonthTitle = useMemo(
    () =>
      `${currentDate.getFullYear()}년 ${String(currentDate.getMonth() + 1).padStart(2, '0')}월`,
    [currentDate]
  );

  const selectedDateKey = useMemo(
    () => (detailDate ? formatDateKey(detailDate) : null),
    [detailDate]
  );
  const {
    desktopSheetPosition,
    setDesktopSheetPositionFromTile,
    clearDesktopSheetPosition,
  } = useDesktopSheetPosition({
    calendarRootRef,
    currentDate,
    detailDate,
  });

  return (
    <div ref={calendarRootRef} className="mt-7 w-full md:relative md:mt-6">
      <Calendar
        value={selectedDate}
        onChange={(value) => setSelectedDate(value as Date)}
        onClickDay={(value, event) => {
          const nextDate = value as Date;
          setSelectedDate(nextDate);
          setDetailDate(nextDate);

          if (event.currentTarget instanceof HTMLElement) {
            setDesktopSheetPositionFromTile(event.currentTarget);
          }
        }}
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
        locale="ko-KR"
        calendarType="gregory"
        className="reservation-calendar"
        tileContent={({ date, view, activeStartDate }) => {
          if (view !== 'month') return null;

          const visibleMonthDate = activeStartDate ?? currentDate;
          const isCurrentMonth =
            date.getMonth() === visibleMonthDate.getMonth() &&
            date.getFullYear() === visibleMonthDate.getFullYear();
          const eventCounts: ReservationEventCounts | undefined =
            EVENT_COUNTS_BY_DATE[formatDateKey(date)];

          return (
            <ReservationCalendarDayTile
              date={date}
              isCurrentMonth={isCurrentMonth}
              eventCounts={eventCounts}
            />
          );
        }}
        tileClassName={({ date, view }) => {
          if (view !== 'month') return undefined;
          const isDetailTarget =
            Boolean(selectedDateKey) && formatDateKey(date) === selectedDateKey;
          return cn(
            'reservation-calendar__day-tile',
            isDetailTarget && 'reservation-calendar__day-tile--detail-target'
          );
        }}
      />
      {detailDate && selectedDateKey ? (
        <ReservationDetailSheet
          key={selectedDateKey}
          isOpen
          selectedDate={detailDate}
          detailData={RESERVATION_DETAIL_BY_DATE[selectedDateKey]}
          desktopPosition={desktopSheetPosition}
          onClose={() => {
            setDetailDate(null);
            clearDesktopSheetPosition();
          }}
        />
      ) : null}
    </div>
  );
}
