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
  /** 예약 내역이 있으면 빨간 도트 표시 */
  showNotificationDot?: boolean;
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
  showNotificationDot = false,
}: ReservationCalendarDayTileProps) {
  const isMuted = !isCurrentMonth;
  const hasBadgeCounts =
    eventCounts !== undefined &&
    Object.values(eventCounts).some((value) => value > 0);
  const shouldShowNotificationDot = showNotificationDot || hasBadgeCounts;
  const dayOfWeek = date.getDay();
  const weekendTextClassName =
    dayOfWeek === 0
      ? 'reservation-status-calendar__day-number--sunday'
      : dayOfWeek === 6
        ? 'reservation-status-calendar__day-number--saturday'
        : '';

  return (
    <div className="reservation-status-calendar__day-overlay">
      <div className="reservation-status-calendar__day-number-wrap">
        <span
          className={`reservation-status-calendar__day-number ${weekendTextClassName} ${isMuted ? 'reservation-status-calendar__day-number--muted' : ''}`}
        >
          {date.getDate()}
        </span>
        {shouldShowNotificationDot ? (
          <NotificationDot isMuted={isMuted} />
        ) : null}
      </div>

      {eventCounts ? (
        <div
          className={`reservation-status-calendar__event-badge-list ${isMuted ? 'reservation-status-calendar__meta--muted' : ''}`}
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
