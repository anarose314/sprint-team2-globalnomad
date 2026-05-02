export const STATUS_TEXT = {
  canceled: '예약 취소',
  pending: '예약 완료',
  declined: '예약 거절',
  completed: '체험 완료',
  confirmed: '예약 승인',
} as const;

export type ReservationStatus = keyof typeof STATUS_TEXT;
