'use client';

import { useMemo, useRef, useState } from 'react';
import Calendar from 'react-calendar';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ReservationCalendarDayTile } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/reservationCalendarDayTile';
import { ReservationDetailSheet } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/reservationDetailSheet';
import { useDesktopSheetPosition } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/hooks/useDesktopSheetPosition';
import { useReservationCalendarData } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/hooks/useReservationCalendarData';
import { ReservationEventCounts } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import {
  parseDateQueryKey,
  toDateFromDateKey,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/utils/dateQuery';
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
interface ReservationCalendarProps {
  activityId: number | null;
}

export function ReservationCalendar({ activityId }: ReservationCalendarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [fallbackSelectedDate, setFallbackSelectedDate] = useState<Date>(
    () => new Date()
  );
  const calendarRootRef = useRef<HTMLDivElement>(null);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const dateKeyFromQuery = useMemo(
    () => parseDateQueryKey(searchParams.get('date')),
    [searchParams]
  );

  const currentMonthTitle = useMemo(
    () =>
      `${currentDate.getFullYear()}년 ${String(currentDate.getMonth() + 1).padStart(2, '0')}월`,
    [currentDate]
  );

  const selectedDateKey = useMemo(() => dateKeyFromQuery, [dateKeyFromQuery]);
  const detailDate = useMemo(
    () => (dateKeyFromQuery ? toDateFromDateKey(dateKeyFromQuery) : null),
    [dateKeyFromQuery]
  );
  const selectedDate = detailDate ?? fallbackSelectedDate;
  const activeStartDate = detailDate
    ? new Date(detailDate.getFullYear(), detailDate.getMonth(), 1)
    : currentDate;
  const { detailData, eventCountsByDate } = useReservationCalendarData({
    activityId,
    currentYear,
    currentMonth,
    reservedScheduleDateKey: selectedDateKey,
  });
  const {
    desktopSheetPosition,
    setDesktopSheetPositionFromTile,
    clearDesktopSheetPosition,
  } = useDesktopSheetPosition({
    calendarRootRef,
    currentDate,
    detailDate,
  });

  const updateDateQuery = (nextDateKey: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextDateKey) {
      params.set('date', nextDateKey);
    } else {
      params.delete('date');
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (activityId === null) {
    return (
      <div className="shadow-card bg-gray-25 mt-7 flex h-192 w-full items-center justify-center rounded-3xl md:mt-6">
        <p className="typo-lg-medium text-gray-500">
          예약 현황을 확인할 체험을 선택해주세요.
        </p>
      </div>
    );
  }

  return (
    <div ref={calendarRootRef} className="mt-7 w-full md:relative md:mt-6">
      <Calendar
        value={selectedDate}
        onChange={(value) => setFallbackSelectedDate(value as Date)}
        onClickDay={(value, event) => {
          const nextDate = value as Date;
          const nextDateKey = formatDateKey(nextDate);
          setFallbackSelectedDate(nextDate);
          updateDateQuery(nextDateKey);

          if (event.currentTarget instanceof HTMLElement) {
            setDesktopSheetPositionFromTile(event.currentTarget);
          }
        }}
        activeStartDate={activeStartDate}
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
            eventCountsByDate[formatDateKey(date)];

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
          activityId={activityId}
          isOpen
          selectedDate={detailDate}
          detailData={detailData}
          desktopPosition={desktopSheetPosition}
          onClose={() => {
            updateDateQuery(null);
            clearDesktopSheetPosition();
          }}
        />
      ) : null}
    </div>
  );
}
