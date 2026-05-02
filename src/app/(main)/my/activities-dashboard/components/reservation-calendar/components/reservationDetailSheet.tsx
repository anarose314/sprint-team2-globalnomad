import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ReservationDetailMockData,
  ReservationRequestStatus,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import { IcArrowDown, IcClose } from '@/shared/assets/icons';
import { Button } from '@/shared/components/buttons/button';
import { StatusBadge } from '@/shared/components/status-badge';

interface ReservationDetailSheetProps {
  isOpen: boolean;
  selectedDate: Date;
  detailData?: ReservationDetailMockData;
  desktopPosition?: {
    top: number;
    left: number;
  } | null;
  onClose: () => void;
}

type ReservationTab = ReservationRequestStatus;

const TAB_LABEL: Record<ReservationTab, string> = {
  pending: '신청',
  approved: '승인',
  rejected: '거절',
};

function formatDetailDate(date: Date) {
  return `${String(date.getFullYear()).slice(2)}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function toReservationBadgeStatus(status: ReservationRequestStatus) {
  if (status === 'approved') return 'confirmed';
  return 'declined';
}

export function ReservationDetailSheet({
  isOpen,
  selectedDate,
  detailData,
  desktopPosition,
  onClose,
}: ReservationDetailSheetProps) {
  const sheetRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<ReservationTab>('pending');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(
    detailData?.timeSlots[0] ?? '예약 가능한 시간이 없습니다'
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleEscClose = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscClose);
    return () => window.removeEventListener('keydown', handleEscClose);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDownOutside = (event: PointerEvent) => {
      const sheetElement = sheetRef.current;
      if (!sheetElement) return;
      if (sheetElement.contains(event.target as Node)) return;
      onClose();
    };

    document.addEventListener('pointerdown', handlePointerDownOutside);
    return () =>
      document.removeEventListener('pointerdown', handlePointerDownOutside);
  }, [isOpen, onClose]);

  const tabCount = useMemo(() => {
    const base = { pending: 0, approved: 0, rejected: 0 };
    if (!detailData) return base;

    detailData.requests.forEach((request) => {
      base[request.status] += 1;
    });

    return base;
  }, [detailData]);

  const filteredRequests = useMemo(
    () =>
      detailData?.requests.filter((request) => request.status === activeTab) ??
      [],
    [activeTab, detailData]
  );

  if (!isOpen) return null;

  return (
    <div
      className="reservation-detail-sheet__backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="예약 상세"
      onClick={onClose}
    >
      <section
        ref={sheetRef}
        className="reservation-detail-sheet"
        style={desktopPosition ?? undefined}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="reservation-detail-sheet__header">
          <h3 className="reservation-detail-sheet__title">
            {formatDetailDate(selectedDate)}
          </h3>
          <button
            type="button"
            className="reservation-detail-sheet__close"
            aria-label="예약 상세 닫기"
            onClick={onClose}
          >
            <IcClose className="h-5 w-5" />
          </button>
        </header>

        <nav className="reservation-detail-sheet__tabs">
          {(['pending', 'approved', 'rejected'] as const).map((tabKey) => (
            <button
              key={tabKey}
              type="button"
              onClick={() => setActiveTab(tabKey)}
              className={`reservation-detail-sheet__tab ${activeTab === tabKey ? 'reservation-detail-sheet__tab--active' : ''}`}
            >
              {TAB_LABEL[tabKey]} {tabCount[tabKey]}
            </button>
          ))}
        </nav>

        <div className="reservation-detail-sheet__section">
          <p className="reservation-detail-sheet__section-title">예약 시간</p>
          <div className="reservation-detail-sheet__select-wrap">
            <select
              className="reservation-detail-sheet__select"
              value={selectedTimeSlot}
              onChange={(event) => setSelectedTimeSlot(event.target.value)}
              disabled={!detailData?.timeSlots.length}
            >
              {(detailData?.timeSlots.length
                ? detailData.timeSlots
                : ['예약 가능한 시간이 없습니다']
              ).map((timeSlot) => (
                <option key={timeSlot} value={timeSlot}>
                  {timeSlot}
                </option>
              ))}
            </select>
            <IcArrowDown className="reservation-detail-sheet__select-icon" />
          </div>
        </div>

        <div className="reservation-detail-sheet__section">
          <p className="reservation-detail-sheet__section-title">예약 내역</p>
          {filteredRequests.length ? (
            <ul className="reservation-detail-sheet__request-list">
              {filteredRequests.map((request) => (
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
          ) : (
            <p className="reservation-detail-sheet__empty">
              해당 상태의 예약 내역이 없습니다.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
