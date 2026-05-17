import { useCallback, useEffect, useRef, useState } from 'react';
import { formatDetailDate } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/reservationDetailSheet.constants';
import { ReservationDetailSheetRequestList } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/reservationDetailSheetRequestList';
import { ReservationDetailSheetTabs } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/reservationDetailSheetTabs';
import { useReservationDetailSheet } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/useReservationDetailSheet';
import { ReservationDetailData } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import { IcClose } from '@/shared/assets/icons';
import { Dropdown } from '@/shared/components/dropdown';
import { Heading } from '@/shared/components/heading';
import { OneButtonModal, TwoButtonModal } from '@/shared/components/modal';
import { ModalOverlay } from '@/shared/components/modal/modal-overlay';
import { cn } from '@/shared/utils/cn';

/** 닫힘 전용 키프레임 길이와 맞춤 (모바일 바텀시트·배경 320ms, 2xl 플로팅 300ms 중 긴 쪽) */
const DETAIL_SHEET_CLOSE_MS = 320;

function getDetailSheetCloseDurationMs() {
  if (typeof window === 'undefined') return DETAIL_SHEET_CLOSE_MS;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 0
    : DETAIL_SHEET_CLOSE_MS;
}

interface ReservationDetailSheetProps {
  activityId: number;
  /** 상세 바텀시트/플로팅 패널 노출 여부 */
  isOpen: boolean;
  /** 헤더에 표시할 선택 날짜 */
  selectedDate: Date;
  /** 날짜별 예약 상세 데이터(시간 슬롯 + 요청 목록) */
  detailData?: ReservationDetailData;
  /** 2xl 이상에서 달력 타일 기준으로 계산된 패널 절대 위치 */
  desktopPosition?: {
    top: number;
    left: number;
  } | null;
  /** 외부 클릭/ESC/닫기 버튼에서 호출되는 닫기 핸들러 */
  onClose: () => void;
}

/**
 * 날짜별 예약 상세를 보여주는 바텀시트/플로팅 패널
 *
 * - 모바일/태블릿: 바텀시트
 * - 대형 데스크톱: 달력 옆 플로팅 패널
 * - 예약 내역 영역만 독립 스크롤 및 무한스크롤 뼈대 적용
 */
export function ReservationDetailSheet({
  activityId,
  isOpen,
  selectedDate,
  detailData,
  desktopPosition,
  onClose,
}: ReservationDetailSheetProps) {
  const isClosingRef = useRef(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const requestClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    setIsClosing(true);
    const durationMs = getDetailSheetCloseDurationMs();
    closeTimerRef.current = setTimeout(() => {
      onClose();
    }, durationMs);
  }, [onClose]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const {
    activeTab,
    requests,
    isLoadingRequests,
    isFetchingNextPage,
    hasMoreRequests,
    requestListEndRef,
    requestScrollRef,
    selectedTimeSlotValue,
    isSelectedTimeSlotEnded,
    isUpdatingStatus,
    confirmationModalMessage,
    feedbackModalMessage,
    isDateReservationEmpty,
    selectedTimeSlotCount,
    setActiveTab,
    handleTimeSlotChange,
    handleApproveReservation,
    handleRejectReservation,
    cancelStatusUpdateConfirmation,
    confirmStatusUpdate,
    closeFeedbackModal,
    sheetRef,
    shouldUseFixedRequestViewport,
    tabCount,
  } = useReservationDetailSheet({
    activityId,
    isOpen,
    selectedDate,
    detailData,
    onClose: requestClose,
  });
  const timeSlotOptions = detailData?.timeSlots.length
    ? detailData.timeSlots.map((timeSlot) => ({
        label: timeSlot.label,
        value: timeSlot.value,
      }))
    : [];

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'reservation-detail-sheet__backdrop',
        isClosing && 'reservation-detail-sheet__backdrop--closing'
      )}
      role="dialog"
      aria-modal="true"
      aria-label="예약 상세"
      onClick={requestClose}
    >
      <section
        ref={sheetRef}
        className={cn(
          'reservation-detail-sheet',
          isClosing && 'reservation-detail-sheet--closing'
        )}
        style={desktopPosition ?? undefined}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="reservation-detail-sheet__inner">
          <header className="reservation-detail-sheet__header">
            <Heading as="h3" className="reservation-detail-sheet__title">
              {formatDetailDate(selectedDate)}
            </Heading>
            <button
              type="button"
              className="reservation-detail-sheet__close"
              aria-label="예약 상세 닫기"
              onClick={requestClose}
            >
              <IcClose className="h-5 w-5" />
            </button>
          </header>

          <ReservationDetailSheetTabs
            activeTab={activeTab}
            tabCount={tabCount}
            onChangeTab={setActiveTab}
          />

          <div className="reservation-detail-sheet__content">
            {timeSlotOptions.length > 0 ? (
              <div className="reservation-detail-sheet__section">
                <p className="reservation-detail-sheet__section-title">
                  예약 시간
                </p>
                <Dropdown
                  options={timeSlotOptions}
                  value={selectedTimeSlotValue}
                  optionHeight={44}
                  maxVisibleOptions={4}
                  className="reservation-detail-sheet__select-wrap"
                  triggerClassName="reservation-detail-sheet__select"
                  menuClassName="reservation-detail-sheet__select-menu"
                  onChange={handleTimeSlotChange}
                />
              </div>
            ) : null}

            <div className="reservation-detail-sheet__section reservation-detail-sheet__section--requests">
              <p className="reservation-detail-sheet__section-title">
                예약 내역
              </p>
              <div
                ref={requestScrollRef}
                className={cn(
                  'reservation-detail-sheet__request-scroll',
                  shouldUseFixedRequestViewport &&
                    'reservation-detail-sheet__request-scroll--fixed'
                )}
              >
                <ReservationDetailSheetRequestList
                  activeTab={activeTab}
                  isEmpty={!isLoadingRequests && !requests.length}
                  isLoading={isLoadingRequests}
                  isDateReservationEmpty={isDateReservationEmpty}
                  requests={requests}
                  selectedTimeSlotCount={selectedTimeSlotCount}
                  isSelectedTimeSlotEnded={isSelectedTimeSlotEnded}
                  isUpdatingStatus={isUpdatingStatus}
                  hasMoreRequests={hasMoreRequests}
                  isFetchingNextPage={isFetchingNextPage}
                  onApprove={handleApproveReservation}
                  onReject={handleRejectReservation}
                  sentinelRef={requestListEndRef}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {feedbackModalMessage ? (
        <ModalOverlay onClose={closeFeedbackModal}>
          <OneButtonModal
            message={feedbackModalMessage}
            onConfirm={closeFeedbackModal}
          />
        </ModalOverlay>
      ) : null}

      {confirmationModalMessage ? (
        <ModalOverlay onClose={cancelStatusUpdateConfirmation}>
          <div className="reservation-detail-sheet__confirm-modal">
            <TwoButtonModal
              message={confirmationModalMessage}
              cancelText="취소"
              confirmText="확인"
              onCancel={cancelStatusUpdateConfirmation}
              onConfirm={confirmStatusUpdate}
            />
          </div>
        </ModalOverlay>
      ) : null}
    </div>
  );
}
