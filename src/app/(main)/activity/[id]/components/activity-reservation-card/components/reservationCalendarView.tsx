import Calendar from 'react-calendar';
import { WEEKDAY } from '@/app/(main)/activity/[id]/components/activity-reservation-card/activityReservationCard.constants';
import { IcArrowLeft, IcArrowRight } from '@/shared/assets/icons';

interface ReservationCalendarViewProps {
  value: Date;
  activeStartDate: Date;
  monthTitle: string;
  className: string;
  onDateChange: (value: unknown) => void;
  onMonthChange: (activeStartDate?: Date | null) => void;
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
      className={className}
    />
  );
}
