import { useMemo, useRef, useState } from 'react';
import { ReservationTab } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/reservationDetailSheet.constants';
import { useCurrentTimestamp } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/useCurrentTimestamp';
import { useDetailModal } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/useDetailModal';
import { useReservationRequests } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/useReservationRequests';
import { useReservationStatusUpdate } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/useReservationStatusUpdate';
import { useSelectedTimeSlot } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/useSelectedTimeSlot';
import { ReservationDetailData } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';

interface UseReservationDetailSheetParams {
  activityId: number;
  isOpen: boolean;
  selectedDate: Date;
  detailData?: ReservationDetailData;
  onClose: () => void;
}

/**
 * 예약 상세 패널의 상태/파생값/이벤트 사이드이펙트를 캡슐화
 */
export const useReservationDetailSheet = ({
  activityId,
  isOpen,
  selectedDate,
  detailData,
  onClose,
}: UseReservationDetailSheetParams) => {
  const sheetRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<ReservationTab>('pending');
  const nowTimestamp = useCurrentTimestamp(isOpen);
  const {
    selectedTimeSlotValue,
    selectedTimeSlot,
    selectedScheduleId,
    handleTimeSlotChange,
  } = useSelectedTimeSlot({ detailData });

  const {
    isUpdatingStatus,
    confirmationModalMessage,
    feedbackModalMessage,
    handleApproveReservation,
    handleRejectReservation,
    cancelStatusUpdateConfirmation,
    confirmStatusUpdate,
    closeFeedbackModal,
  } = useReservationStatusUpdate({
    activityId,
    selectedScheduleId,
  });

  useDetailModal({ isOpen, onClose, sheetRef });

  const selectedTimeSlotEndTime = selectedTimeSlot?.endTime;

  const isSelectedTimeSlotEnded = useMemo(() => {
    if (!selectedTimeSlotEndTime) return false;

    const [hourString, minuteString] = selectedTimeSlotEndTime.split(':');
    const hour = Number(hourString);
    const minute = Number(minuteString);
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) return false;

    const endDateTime = new Date(selectedDate);
    endDateTime.setHours(hour, minute, 0, 0);

    return endDateTime.getTime() < nowTimestamp;
  }, [nowTimestamp, selectedDate, selectedTimeSlotEndTime]);

  const {
    requests,
    isLoadingRequests,
    isFetchingNextPage,
    hasMoreRequests,
    requestScrollRef,
    requestListEndRef,
  } = useReservationRequests({
    activityId,
    selectedScheduleId,
    activeTab,
    isOpen,
    isSelectedTimeSlotEnded,
  });

  const tabCount = useMemo(() => {
    return selectedTimeSlot?.count ?? { pending: 0, confirmed: 0, declined: 0 };
  }, [selectedTimeSlot]);

  const isDateReservationEmpty = useMemo(() => {
    const timeSlots = detailData?.timeSlots ?? [];
    if (timeSlots.length === 0) return true;

    return timeSlots.every((timeSlot) =>
      Object.values(timeSlot.count).every((count) => count === 0)
    );
  }, [detailData]);

  const shouldUseFixedRequestViewport = useMemo(() => {
    const timeSlots = detailData?.timeSlots ?? [];

    return timeSlots.some((timeSlot) =>
      Object.values(timeSlot.count).some((count) => count >= 2)
    );
  }, [detailData]);

  return {
    activeTab,
    requests,
    selectedTimeSlotCount: tabCount,
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
    handleTimeSlotChange,
    handleApproveReservation,
    handleRejectReservation,
    cancelStatusUpdateConfirmation,
    confirmStatusUpdate,
    closeFeedbackModal,
    setActiveTab,
    sheetRef,
    shouldUseFixedRequestViewport,
    tabCount,
  };
};
