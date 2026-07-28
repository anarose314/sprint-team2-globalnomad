import { ReservationStatus } from '@/shared/constants/status.constants';

export type ReservationEventStatus = Extract<
  ReservationStatus,
  'pending' | 'confirmed' | 'completed'
>;

export type ReservationEventCounts = Partial<
  Record<ReservationEventStatus, number>
>;

export type ReservationRequestStatus = Extract<
  ReservationStatus,
  'pending' | 'confirmed' | 'declined'
>;

export type ReservationRequestDisplayStatus =
  | ReservationRequestStatus
  | 'completed';

export interface ReservationRequestItem {
  id: number;
  nickname: string;
  headCount: number;
  status: ReservationRequestDisplayStatus;
  createdAt: string;
}

export interface ReservationTimeSlotOption {
  scheduleId: number | null;
  startTime: string;
  endTime: string;
  label: string;
  value: string;
  count: {
    pending: number;
    confirmed: number;
    declined: number;
  };
}

export interface ReservationDetailData {
  timeSlots: ReservationTimeSlotOption[];
}

/** 캘린더 한 날짜의 표시 상태(상태별 배지 집계, 알림 도트 노출 여부) */
export interface ReservationCalendarDateDisplayState {
  eventCounts: ReservationEventCounts;
  hasNotificationDot: boolean;
}

/** 날짜(`YYYY-MM-DD`)별 캘린더 표시 상태 */
export type ReservationCalendarDisplayByDate = Record<
  string,
  ReservationCalendarDateDisplayState
>;
