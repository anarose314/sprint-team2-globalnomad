import { RefObject } from 'react';
import {
  ReservationTab,
  toReservationBadgeStatus,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/reservationDetailSheet.constants';
import { ReservationRequestItem } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import { Button } from '@/shared/components/buttons/button';
import { StatusBadge } from '@/shared/components/status-badge';

interface ReservationDetailSheetRequestListProps {
  activeTab: ReservationTab;
  isEmpty: boolean;
  isLoading: boolean;
  requests: ReservationRequestItem[];
  hasMoreRequests: boolean;
  isFetchingNextPage: boolean;
  sentinelRef: RefObject<HTMLDivElement | null>;
}

/**
 * 예약 내역 리스트 렌더링 블록
 *
 * 스크롤 컨테이너 자체는 부모에서 관리하고
 * 본 컴포넌트는 비어있음/리스트/센티넬 렌더링만 담당
 */
export function ReservationDetailSheetRequestList({
  activeTab,
  isEmpty,
  isLoading,
  requests,
  hasMoreRequests,
  isFetchingNextPage,
  sentinelRef,
}: ReservationDetailSheetRequestListProps) {
  if (isLoading) {
    return (
      <p className="reservation-detail-sheet__empty">
        예약 내역을 불러오는 중입니다.
      </p>
    );
  }

  if (isEmpty) {
    return (
      <p className="reservation-detail-sheet__empty">
        해당 날짜에 예약 내역이 없습니다.
      </p>
    );
  }

  return (
    <>
      <ul className="reservation-detail-sheet__request-list">
        {requests.map((request) => (
          <li
            key={request.id}
            className="reservation-detail-sheet__request-card"
          >
            <div className="reservation-detail-sheet__request-info">
              <p className="reservation-detail-sheet__request-row">
                <span className="reservation-detail-sheet__request-label">
                  닉네임
                </span>
                <span className="reservation-detail-sheet__request-value">
                  {request.nickname}
                </span>
              </p>
              <p className="reservation-detail-sheet__request-row">
                <span className="reservation-detail-sheet__request-label">
                  인원
                </span>
                <span className="reservation-detail-sheet__request-value">
                  {request.headCount}명
                </span>
              </p>
            </div>
            {activeTab === 'pending' ? (
              <div className="reservation-detail-sheet__actions">
                <Button
                  variant="secondary"
                  size="sm"
                  className="reservation-detail-sheet__action-button reservation-detail-sheet__action-button--approve"
                  disabled={request.status !== 'pending'}
                >
                  승인하기
                </Button>
                <Button
                  size="sm"
                  className="reservation-detail-sheet__action-button reservation-detail-sheet__action-button--reject"
                  disabled={request.status !== 'pending'}
                >
                  거절하기
                </Button>
              </div>
            ) : (
              <StatusBadge
                status={toReservationBadgeStatus(activeTab)}
                className="reservation-detail-sheet__status-badge"
              />
            )}
          </li>
        ))}
      </ul>

      {hasMoreRequests ? (
        <div
          ref={sentinelRef}
          className="reservation-detail-sheet__list-sentinel"
          aria-hidden="true"
        />
      ) : null}
      {isFetchingNextPage ? (
        <p className="reservation-detail-sheet__loading-more">
          더 불러오는 중입니다...
        </p>
      ) : null}
    </>
  );
}
