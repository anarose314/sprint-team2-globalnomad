import { EventBadge } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/eventBadge';
import { NotificationDot } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/notificationDot';
import { STATUS_META } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.constants';
import {
  ReservationEventCounts,
  ReservationEventStatus,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';

interface ReservationCalendarDayTileProps {
  date: Date;
  isCurrentMonth: boolean;
  eventCounts?: ReservationEventCounts;
}

const STATUS_ORDER = Object.keys(STATUS_META) as ReservationEventStatus[];

/**
 * 캘린더의 개별 날짜 셀 UI 렌더링
 * 날짜 숫자, 알림 점, 상태별 이벤트 배지 스택
 */
export function ReservationCalendarDayTile({
  date,
  isCurrentMonth,
  eventCounts,
}: ReservationCalendarDayTileProps) {
  const isMuted = !isCurrentMonth;
  const dayOfWeek = date.getDay();
  const weekendTextClassName =
    dayOfWeek === 0
      ? 'reservation-calendar__day-number--sunday'
      : dayOfWeek === 6
        ? 'reservation-calendar__day-number--saturday'
        : '';

  return (
    <div className="reservation-calendar__day-overlay">
      <div className="reservation-calendar__day-number-wrap">
        <span
          className={`reservation-calendar__day-number ${weekendTextClassName} ${isMuted ? 'reservation-calendar__day-number--muted' : ''}`}
        >
          {date.getDate()}
        </span>
        {eventCounts ? <NotificationDot isMuted={isMuted} /> : null}
      </div>

      {eventCounts ? (
        <div
          className={`reservation-calendar__event-badge-list ${isMuted ? 'reservation-calendar__meta--muted' : ''}`}
        >
          {STATUS_ORDER.map((status) => {
            const count = eventCounts[status];
            if (!count) return null;

            return <EventBadge key={status} status={status} count={count} />;
          })}
        </div>
      ) : null}
    </div>
  );
}
