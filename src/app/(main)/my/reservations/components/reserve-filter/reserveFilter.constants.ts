import { ReservationStatus } from '@/shared/constants/status.constants';

export const FILTER_ORDER: ReservationStatus[] = [
  'pending',
  'canceled',
  'confirmed',
  'declined',
  'completed',
];

export const SCROLL_END_THRESHOLD = 20;
