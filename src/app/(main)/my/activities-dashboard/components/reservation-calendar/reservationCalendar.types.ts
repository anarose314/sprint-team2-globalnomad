export type ReservationEventStatus = 'pending' | 'approved' | 'completed';

export type ReservationEventCounts = Partial<
  Record<ReservationEventStatus, number>
>;
