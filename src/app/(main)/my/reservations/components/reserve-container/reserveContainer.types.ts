import { MyReservationsSearchParams } from '@/app/(main)/my/reservations/reservations.types';

export interface ReserveContainerProps {
  searchParams: Promise<MyReservationsSearchParams>;
}
