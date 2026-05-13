import { ReservationStatus } from '@/shared/constants/status.constants';

export interface ReservationInfo {
  id: number;
  status: ReservationStatus;
  title: string;
  description: string;
}

export interface ReserveButtonsProps {
  reservationInfo: ReservationInfo;
}
