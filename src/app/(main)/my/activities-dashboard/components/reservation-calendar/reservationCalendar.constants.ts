import {
  ReservationDetailMockData,
  ReservationEventCounts,
  ReservationEventStatus,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';

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

/** 날짜별 예약 상태 개수 목데이터 */
export const EVENT_COUNTS_BY_DATE: Record<string, ReservationEventCounts> = {
  '2026-09-01': { pending: 1, confirmed: 1, completed: 1 },
  '2026-09-03': { pending: 2 },
  '2026-09-07': { confirmed: 1 },
  '2026-09-15': { completed: 3 },
};

/** 날짜별 예약 상세 목데이터 */
export const RESERVATION_DETAIL_BY_DATE: Record<
  string,
  ReservationDetailMockData
> = {
  '2026-09-01': {
    timeSlots: ['14:00 - 15:00', '15:00 - 16:00'],
    requests: [
      { id: 1, nickname: '정만철', headCount: 10, status: 'pending' },
      { id: 2, nickname: '정만철', headCount: 12, status: 'pending' },
    ],
  },
  '2026-09-03': {
    timeSlots: ['11:00 - 12:00', '13:00 - 14:00'],
    requests: [
      { id: 3, nickname: '민수', headCount: 4, status: 'confirmed' },
      { id: 4, nickname: '하늘', headCount: 2, status: 'pending' },
      { id: 5, nickname: '다현', headCount: 6, status: 'declined' },
    ],
  },
  '2026-09-07': {
    timeSlots: ['10:00 - 11:00'],
    requests: [{ id: 6, nickname: '지은', headCount: 3, status: 'confirmed' }],
  },
  '2026-09-15': {
    timeSlots: ['16:00 - 17:00'],
    requests: [{ id: 7, nickname: '현우', headCount: 5, status: 'declined' }],
  },
};
