'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Calendar from 'react-calendar';
import { ReservationCalendarDayTile } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/reservationCalendarDayTile';
import { ReservationDetailSheet } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/reservationDetailSheet';
import {
  EVENT_COUNTS_BY_DATE,
  RESERVATION_DETAIL_BY_DATE,
  WEEKDAY,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.constants';
import { ReservationEventCounts } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import { IcArrowLeft, IcArrowRight } from '@/shared/assets/icons';
import '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservation-calendar.css';

/**
 * Date 객체를 예약 캘린더 이벤트 맵에서 사용하는 yyyy-mm-dd 키로 변환
 */
function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 예약 현황 페이지에서 월 단위 예약 상태를 보여주는 캘린더 컴포넌트
 * 날짜별 예약/승인/완료 배지를 표시
 */
export function ReservationCalendar() {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [detailDate, setDetailDate] = useState<Date | null>(null);
  const [desktopSheetPosition, setDesktopSheetPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const calendarRootRef = useRef<HTMLDivElement>(null);

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

  const selectedDateKey = useMemo(
    () => (detailDate ? toDateKey(detailDate) : null),
    [detailDate]
  );

  const setDesktopSheetPositionFromTile = useCallback(
    (tileElement: HTMLElement) => {
      if (window.innerWidth < 768) {
        setDesktopSheetPosition(null);
        return;
      }

      const calendarRoot = calendarRootRef.current;
      if (!calendarRoot) return;

      const rootRect = calendarRoot.getBoundingClientRect();
      const tileRect = tileElement.getBoundingClientRect();

      const SHEET_WIDTH = 320;
      const EDGE_OFFSET = -4;
      const VERTICAL_OFFSET = 6;

      const rightAlignedLeft = tileRect.right - rootRect.left + EDGE_OFFSET;
      const rightAlignedViewportRight =
        rootRect.left + rightAlignedLeft + SHEET_WIDTH;

      const shouldOpenLeft = rightAlignedViewportRight > window.innerWidth;
      const leftAlignedLeft =
        tileRect.left - rootRect.left - SHEET_WIDTH - EDGE_OFFSET;

      const nextLeft = shouldOpenLeft
        ? Math.max(0, leftAlignedLeft)
        : rightAlignedLeft;
      const nextTop = tileRect.top - rootRect.top + VERTICAL_OFFSET;

      setDesktopSheetPosition({
        top: nextTop,
        left: nextLeft,
      });
    },
    []
  );

  const updateDesktopSheetPosition = useCallback(() => {
    if (!detailDate || window.innerWidth < 768) {
      setDesktopSheetPosition(null);
      return;
    }

    const calendarRoot = calendarRootRef.current;
    if (!calendarRoot) return;

    const targetTile = calendarRoot.querySelector(
      '.reservation-calendar__day-tile--detail-target'
    ) as HTMLElement | null;

    if (!targetTile) return;
    setDesktopSheetPositionFromTile(targetTile);
  }, [detailDate, setDesktopSheetPositionFromTile]);

  useEffect(() => {
    if (!detailDate) return;

    const timerId = window.setTimeout(updateDesktopSheetPosition, 0);
    const handleResize = () => updateDesktopSheetPosition();

    window.addEventListener('resize', handleResize);
    return () => {
      window.clearTimeout(timerId);
      window.removeEventListener('resize', handleResize);
    };
  }, [currentDate, detailDate, updateDesktopSheetPosition]);

  if (!currentDate || !selectedDate) {
    return null;
  }
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
            EVENT_COUNTS_BY_DATE[toDateKey(date)];

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
            Boolean(selectedDateKey) && toDateKey(date) === selectedDateKey;

          return `reservation-calendar__day-tile ${isDetailTarget ? 'reservation-calendar__day-tile--detail-target' : ''}`;
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
            setDesktopSheetPosition(null);
          }}
        />
      ) : null}
    </div>
  );
}
