import { ReservationStatus } from '@/shared/constants/status.constants';

// 개별 예약 아이템
export interface Reservation {
  id: number;
  teamId: string;
  userId: number;
  activity: {
    bannerImageUrl: string;
    title: string;
    id: number;
  };
  scheduleId: number;
  status: ReservationStatus;
  reviewSubmitted: boolean;
  totalPrice: number;
  headCount: number;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

// API 응답 데이터
export interface MyReservationsResponse {
  cursorId: number | null;
  reservations: Reservation[];
  totalCount: number;
}
