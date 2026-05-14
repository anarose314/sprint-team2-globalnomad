import { ReservationEventStatus } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';

/** 상태별 배지 라벨/색상 매핑 */
export const STATUS_META: Record<
  ReservationEventStatus,
  { label: string; className: string }
> = {
  pending: {
    label: '예약',
    className: 'bg-primary-100 text-primary-500',
  },
  confirmed: {
    label: '승인',
    className: 'bg-orange-100 text-orange-700',
  },
  completed: {
    label: '완료',
    className: 'bg-gray-50 text-gray-500',
  },
};

/** 상태별 배지 세로 위치 클래스 매핑 */
export const STATUS_POSITION_CLASS: Record<ReservationEventStatus, string> = {
  pending: 'reservation-calendar__event-badge--pending',
  confirmed: 'reservation-calendar__event-badge--confirmed',
  completed: 'reservation-calendar__event-badge--completed',
};
