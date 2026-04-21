import { STATUS_TEXT } from '@/shared/constants/status.constants';

export type Status = keyof typeof STATUS_TEXT;

export interface StatusBadgeProps {
  status: Status;
  className?: string;
}
