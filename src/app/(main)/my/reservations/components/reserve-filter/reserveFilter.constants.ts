import { ReservationStatus } from '@/shared/constants/status.constants';

export const FILTER_ORDER: ReservationStatus[] = [
  'confirmed',
  'canceled',
  'pending',
  'declined',
  'completed',
];

export const SCROLL_END_THRESHOLD = 20;
