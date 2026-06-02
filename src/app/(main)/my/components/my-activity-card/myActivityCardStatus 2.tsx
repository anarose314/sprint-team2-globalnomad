import { StatusBadge } from '@/shared/components/status-badge';
import { ReservationStatus } from '@/shared/constants/status.constants';

interface MyActivityCardStatusProps {
  status: ReservationStatus;
}

export function MyActivityCardStatus({ status }: MyActivityCardStatusProps) {
  return <StatusBadge status={status} />;
}
