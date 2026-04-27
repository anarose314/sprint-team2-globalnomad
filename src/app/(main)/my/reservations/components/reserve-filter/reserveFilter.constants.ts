import { STATUS_TEXT } from '@/shared/constants/status.constants';

export const FILTER_ORDER = [
  STATUS_TEXT.approved,
  STATUS_TEXT.cancelled,
  STATUS_TEXT.completed,
  STATUS_TEXT.rejected,
  STATUS_TEXT.attended,
];

export const SCROLL_END_THRESHOLD = 20;
