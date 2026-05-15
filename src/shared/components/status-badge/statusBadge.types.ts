import { ReservationStatus } from '@/shared/constants/status.constants';

export interface StatusBadgeProps {
  status: ReservationStatus;
  className?: string;
}
