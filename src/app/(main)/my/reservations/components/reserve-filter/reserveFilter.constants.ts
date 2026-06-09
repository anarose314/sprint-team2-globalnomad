import { ReservationStatus } from '@/shared/constants/status.constants';

export const FILTER_ORDER: ReservationStatus[] = [
  'pending',
  'canceled',
  'confirmed',
  'declined',
  'completed',
];

export const SCROLL_END_THRESHOLD = 20;

export const FILTER_BUTTON_CLASS = 'h-11 min-w-20.5 md:min-w-23.25';
