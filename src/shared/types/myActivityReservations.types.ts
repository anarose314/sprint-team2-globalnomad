import { ReservationStatus } from '@/shared/constants/status.constants';

type MyActivityReservationStatus = Extract<
  ReservationStatus,
  'pending' | 'confirmed' | 'declined'
>;

export interface MyActivityReservationItem {
  id: number;
  nickname: string;
  headCount: number;
  scheduleId: number;
  status: MyActivityReservationStatus;
  createdAt: string;
}

export interface MyActivityReservationsResponse {
  cursorId: number | null;
  totalCount: number;
  reservations: MyActivityReservationItem[];
}
