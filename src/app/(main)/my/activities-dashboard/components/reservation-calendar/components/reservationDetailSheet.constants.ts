import {
  ReservationRequestDisplayStatus,
  ReservationRequestStatus,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import { ReservationStatus } from '@/shared/constants/status.constants';

export type ReservationTab = ReservationRequestStatus;

export const DETAIL_TABS = ['pending', 'confirmed', 'declined'] as const;

export const TAB_LABEL: Record<ReservationTab, string> = {
  pending: '신청',
  confirmed: '승인',
  declined: '거절',
};

export const REQUESTS_PAGE_SIZE = 10;
export const EMPTY_TIME_SLOT = '예약 가능한 시간이 없습니다';

/**
 * 상세 패널 헤더용 날짜 문자열로 변환
 *
 * @param date 표시할 원본 Date
 * @returns `26년 9월 1일` 형태의 문자열
 */
export const formatDetailDate = (date: Date) => {
  return `${String(date.getFullYear()).slice(2)}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

/**
 * 예약 요청 상태를 공통 배지 상태로 매핑
 *
 * @param status 예약 요청 상태(`confirmed` | `declined`)
 * @returns `StatusBadge` 컴포넌트에서 사용하는 상태값
 */
export const toReservationBadgeStatus = (
  status: Exclude<ReservationRequestDisplayStatus, 'pending'>
): ReservationStatus => {
  if (status === 'confirmed') return 'confirmed';
  if (status === 'completed') return 'completed';
  return 'declined';
};
