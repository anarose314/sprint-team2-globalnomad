import Calendar, { type CalendarProps } from 'react-calendar';
import type { CalendarValue } from '@/app/(main)/activity/[id]/components/activity-reservation-card/activityReservationCard.types';
import { IcArrowLeft, IcArrowRight } from '@/shared/assets/icons';
import { WEEKDAY } from '@/shared/constants/calendar.constants';

interface ReservationCalendarViewProps {
  value: Date | null;
  activeStartDate: Date;
  monthTitle: string;
  className: string;
  onDateChange: (value: CalendarValue) => void;
  onMonthChange: (activeStartDate?: Date | null) => void;
  tileDisabled?: NonNullable<CalendarProps['tileDisabled']>;
}

/**
 * @description 예약 카드/바텀시트에서 공통으로 사용하는 캘린더 뷰
 */
export function ReservationCalendarView({
  value,
  activeStartDate,
  monthTitle,
  className,
  onDateChange,
  onMonthChange,
  tileDisabled,
}: ReservationCalendarViewProps) {
  return (
    <Calendar
      value={value}
      onChange={onDateChange}
      onClickDay={onDateChange}
      activeStartDate={activeStartDate}
      onActiveStartDateChange={({ activeStartDate }) =>
        onMonthChange(activeStartDate)
      }
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
      tileDisabled={tileDisabled}
      className={className}
    />
  );
}
