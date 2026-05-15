import {
  STATUS_META,
  STATUS_POSITION_CLASS,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.constants';
import { ReservationEventStatus } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import { cn } from '@/shared/utils/cn';

interface EventBadgeProps {
  status: ReservationEventStatus;
  count: number;
}

/**
 * 이벤트 배지 컴포넌트 (예약 / 승인 / 완료)
 */
export function EventBadge({ status, count }: EventBadgeProps) {
  return (
    <span
      className={cn(
        'reservation-status-calendar__event-badge',
        STATUS_POSITION_CLASS[status],
        STATUS_META[status].className
      )}
    >
      {STATUS_META[status].label} {count}
    </span>
  );
}
