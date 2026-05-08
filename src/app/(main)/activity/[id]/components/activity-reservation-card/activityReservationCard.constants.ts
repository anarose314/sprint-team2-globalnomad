import type { TimeSlot } from '@/app/(main)/activity/[id]/components/activity-reservation-card/activityReservationCard.types';

/**
 * @description 1인 기준 목업 금액
 */
export const MOCK_PRICE_PER_PERSON = 1000;

/**
 * @description 예약 카드/바텀시트에서 사용하는 목업 시간 슬롯 목록
 */
export const MOCK_TIME_SLOTS = [
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00',
] as const satisfies readonly TimeSlot[];
