import {
  ReservationEventCounts,
  ReservationEventStatus,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';

/** 요일 헤더 렌더링에 사용되는 영문 약어 목록 */
export const WEEKDAY = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

/** 상태별 배지 라벨/색상 매핑 */
export const STATUS_META: Record<
  ReservationEventStatus,
  { label: string; className: string }
> = {
  pending: {
    label: '예약',
    className: 'bg-primary-100 text-primary-500',
  },
  approved: {
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
  approved: 'reservation-calendar__event-badge--approved',
  completed: 'reservation-calendar__event-badge--completed',
};

/** 날짜별 예약 상태 개수 목데이터 */
export const EVENT_COUNTS_BY_DATE: Record<string, ReservationEventCounts> = {
  '2026-09-01': { pending: 1, approved: 1, completed: 1 },
  '2026-09-03': { pending: 2 },
  '2026-09-07': { approved: 1 },
  '2026-09-15': { completed: 3 },
};
