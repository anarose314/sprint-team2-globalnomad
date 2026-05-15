export const STATUS_TEXT = {
  pending: '예약 신청',
  confirmed: '예약 승인',
  declined: '예약 거절',
  canceled: '예약 취소',
  completed: '체험 완료',
} as const;

export type ReservationStatus = keyof typeof STATUS_TEXT;
