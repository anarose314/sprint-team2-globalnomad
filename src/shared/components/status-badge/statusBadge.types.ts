import { STATUS_TEXT } from '@/shared/constants/status.constants';

type Status = keyof typeof STATUS_TEXT;

export interface StatusBadgeProps {
  status: Status;
  className?: string;
}
