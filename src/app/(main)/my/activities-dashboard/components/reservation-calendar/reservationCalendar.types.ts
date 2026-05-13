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

export interface ReservationRequestItem {
  id: number;
  nickname: string;
  headCount: number;
  status: ReservationRequestStatus;
  createdAt: string;
}

export interface ReservationTimeSlotOption {
  scheduleId: number | null;
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
