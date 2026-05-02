export type ReservationEventStatus = 'pending' | 'approved' | 'completed';

export type ReservationEventCounts = Partial<
  Record<ReservationEventStatus, number>
>;

export type ReservationRequestStatus = 'pending' | 'approved' | 'rejected';

export interface ReservationRequestItem {
  id: number;
  nickname: string;
  headCount: number;
  status: ReservationRequestStatus;
}

export interface ReservationDetailMockData {
  timeSlots: string[];
  requests: ReservationRequestItem[];
}
