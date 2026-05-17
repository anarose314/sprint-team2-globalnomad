import { ReservationStatus } from '@/shared/constants/status.constants';
import { cn } from '@/shared/utils/cn';

export const FILTER_ORDER: ReservationStatus[] = [
  'pending',
  'canceled',
  'confirmed',
  'declined',
  'completed',
];

export const SCROLL_END_THRESHOLD = 20;

export const FILTER_BUTTON_CLASS = cn('h-10 min-w-20.5 md:min-w-23.25');
