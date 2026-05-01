import {
  STATUS_META,
  STATUS_POSITION_CLASS,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.constants';
import { ReservationEventStatus } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';

interface EventBadgeProps {
  status: ReservationEventStatus;
  count: number;
}

/**
 * 예약 상태별 색상/위치를 적용한 이벤트 배지 컴포넌트입니다.
 */
export function EventBadge({ status, count }: EventBadgeProps) {
  return (
    <span
      className={`reservation-calendar__event-badge ${STATUS_POSITION_CLASS[status]} ${STATUS_META[status].className}`}
    >
      {STATUS_META[status].label} {count}
    </span>
  );
}
