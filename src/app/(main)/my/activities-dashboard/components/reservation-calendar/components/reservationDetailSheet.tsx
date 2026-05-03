import {
  EMPTY_TIME_SLOT,
  formatDetailDate,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/reservationDetailSheet.constants';
import { ReservationDetailSheetRequestList } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/reservationDetailSheetRequestList';
import { ReservationDetailSheetTabs } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/reservationDetailSheetTabs';
import { useReservationDetailSheet } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/useReservationDetailSheet';
import { ReservationDetailMockData } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import { IcArrowDown, IcClose } from '@/shared/assets/icons';
import { cn } from '@/shared/utils/cn';

interface ReservationDetailSheetProps {
  /** 상세 바텀시트/플로팅 패널 노출 여부 */
  isOpen: boolean;
  /** 헤더에 표시할 선택 날짜 */
  selectedDate: Date;
  /** 날짜별 예약 상세 데이터(시간 슬롯 + 요청 목록) */
  detailData?: ReservationDetailMockData;
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
  isOpen,
  selectedDate,
  detailData,
  desktopPosition,
  onClose,
}: ReservationDetailSheetProps) {
  const {
    activeTab,
    filteredRequests,
    hasMoreRequests,
    requestListEndRef,
    requestScrollRef,
    selectedTimeSlot,
    setActiveTab,
    setSelectedTimeSlot,
    setVisibleRequestCount,
    sheetRef,
    shouldUseFixedRequestViewport,
    tabCount,
    visibleRequests,
  } = useReservationDetailSheet({
    isOpen,
    detailData,
    onClose,
  });

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
        <div className="reservation-detail-sheet__inner">
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

          <ReservationDetailSheetTabs
            activeTab={activeTab}
            tabCount={tabCount}
            onChangeTab={setActiveTab}
            onResetVisibleRequestCount={setVisibleRequestCount}
          />

          <div className="reservation-detail-sheet__content">
            <div className="reservation-detail-sheet__section">
              <p className="reservation-detail-sheet__section-title">
                예약 시간
              </p>
              <div className="reservation-detail-sheet__select-wrap">
                <select
                  className="reservation-detail-sheet__select"
                  value={selectedTimeSlot}
                  onChange={(event) => setSelectedTimeSlot(event.target.value)}
                  disabled={!detailData?.timeSlots.length}
                >
                  {(detailData?.timeSlots.length
                    ? detailData.timeSlots
                    : [EMPTY_TIME_SLOT]
                  ).map((timeSlot) => (
                    <option key={timeSlot} value={timeSlot}>
                      {timeSlot}
                    </option>
                  ))}
                </select>
                <IcArrowDown className="reservation-detail-sheet__select-icon" />
              </div>
            </div>

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
                  isEmpty={!filteredRequests.length}
                  visibleRequests={visibleRequests}
                  hasMoreRequests={hasMoreRequests}
                  sentinelRef={requestListEndRef}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
