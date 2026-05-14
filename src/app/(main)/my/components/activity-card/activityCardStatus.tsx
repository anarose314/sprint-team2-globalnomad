import { StatusBadge } from '@/shared/components/status-badge';
import { ReservationStatus } from '@/shared/constants/status.constants';

interface ActivityCardStatusProps {
  status: ReservationStatus;
}

export function ActivityCardStatus({ status }: ActivityCardStatusProps) {
  return <StatusBadge status={status} />;
}
