'use client';

import { DesktopReservationCard } from '@/app/(main)/activity/[id]/components/activity-reservation-card/components/desktopReservationCard';
import { MobileReservationBottomBar } from '@/app/(main)/activity/[id]/components/activity-reservation-card/components/mobileReservationBottomBar';
import { MobileReservationSheet } from '@/app/(main)/activity/[id]/components/activity-reservation-card/components/mobileReservationSheet';
import { useActivityReservationCardState } from '@/app/(main)/activity/[id]/components/activity-reservation-card/hooks/useActivityReservationCardState';
import { OneButtonModal } from '@/shared/components/modal';
import { ModalOverlay } from '@/shared/components/modal/modal-overlay';
import type { ActivitySchedule } from '@/shared/types/activityDetail.types';
import '@/app/(main)/activity/[id]/components/activity-reservation-card/reservation-calendar.css';

/**
 * @description
 * 체험 상세 예약 카드/바텀시트 컴포넌트
 * - PC: 우측 고정 예약 카드 렌더링
 * - 모바일/태블릿: 하단 고정 바 + 날짜 선택 바텀시트 렌더링
 */
interface ActivityReservationCardProps {
  activityId: number;
  pricePerPerson: number;
  schedules: ActivitySchedule[];
}

export function ActivityReservationCard({
  activityId,
  pricePerPerson,
  schedules,
}: ActivityReservationCardProps) {
  const {
    isDateSheetOpen,
    isSuccessModalOpen,
    mobileSheetStep,
    hasSelectableDate,
    isReservationAvailable,
    isReservationSubmitting,
    selectedDate,
    displayCurrentDate,
    monthTitle,
    selectedDateText,
    activeSelectedTimeSlot,
    availableTimeSlots,
    headCount,
    totalPrice,
    handleOpenDateSheet,
    handleCloseDateSheet,
    handleCloseSuccessModal,
    handleMoveToHeadCountStep,
    handleMoveToDateTimeStep,
    handleDateChange,
    handleMonthChange,
    handleSelectTimeSlot,
    handleDecreaseHeadCount,
    handleIncreaseHeadCount,
    handleSubmitReservation,
    tileDisabled,
  } = useActivityReservationCardState({
    activityId,
    pricePerPerson,
    schedules,
  });

  return (
    <>
      <MobileReservationBottomBar
        pricePerPerson={pricePerPerson}
        onOpenDateSheet={handleOpenDateSheet}
      />
      <MobileReservationSheet
        isOpen={isDateSheetOpen}
        mobileSheetStep={mobileSheetStep}
        hasSelectableDate={hasSelectableDate}
        selectedDate={selectedDate}
        currentDate={displayCurrentDate}
        monthTitle={monthTitle}
        selectedDateText={selectedDateText}
        selectedTimeSlot={activeSelectedTimeSlot}
        availableTimeSlots={availableTimeSlots}
        headCount={headCount}
        totalPrice={totalPrice}
        isReservationAvailable={isReservationAvailable}
        isReservationSubmitting={isReservationSubmitting}
        onClose={handleCloseDateSheet}
        onMoveToHeadCountStep={handleMoveToHeadCountStep}
        onMoveToDateTimeStep={handleMoveToDateTimeStep}
        onDateChange={handleDateChange}
        onMonthChange={handleMonthChange}
        onSelectTimeSlot={handleSelectTimeSlot}
        onDecreaseHeadCount={handleDecreaseHeadCount}
        onIncreaseHeadCount={handleIncreaseHeadCount}
        onSubmitReservation={handleSubmitReservation}
        tileDisabled={tileDisabled}
      />

      <DesktopReservationCard
        pricePerPerson={pricePerPerson}
        selectedDate={selectedDate}
        currentDate={displayCurrentDate}
        monthTitle={monthTitle}
        headCount={headCount}
        totalPrice={totalPrice}
        selectedTimeSlot={activeSelectedTimeSlot}
        availableTimeSlots={availableTimeSlots}
        hasSelectableDate={hasSelectableDate}
        isReservationAvailable={isReservationAvailable}
        isReservationSubmitting={isReservationSubmitting}
        onDateChange={handleDateChange}
        onMonthChange={handleMonthChange}
        onDecreaseHeadCount={handleDecreaseHeadCount}
        onIncreaseHeadCount={handleIncreaseHeadCount}
        onSelectTimeSlot={handleSelectTimeSlot}
        onSubmitReservation={handleSubmitReservation}
        tileDisabled={tileDisabled}
      />

      {isSuccessModalOpen ? (
        <ModalOverlay onClose={handleCloseSuccessModal}>
          <OneButtonModal
            message="예약이 완료되었습니다."
            onConfirm={handleCloseSuccessModal}
          />
        </ModalOverlay>
      ) : null}
    </>
  );
}
