import { useMemo, useState } from 'react';
import type {
  ReservationDetailData,
  ReservationTimeSlotOption,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';

interface UseSelectedTimeSlotParams {
  detailData?: ReservationDetailData;
}

/**
 * 예약 상세의 선택된 시간 슬롯 상태와 파생값을 관리하는 훅
 */
export const useSelectedTimeSlot = ({
  detailData,
}: UseSelectedTimeSlotParams) => {
  const [manualSelectedTimeSlotValue, setManualSelectedTimeSlotValue] =
    useState<string | null>(null);

  const selectedTimeSlotValue = useMemo(() => {
    const timeSlots = detailData?.timeSlots ?? [];
    if (!timeSlots.length) return '';

    const defaultTimeSlot =
      timeSlots.find((timeSlot) => timeSlot.scheduleId !== null) ??
      timeSlots[0];

    const hasManualSelected =
      manualSelectedTimeSlotValue !== null &&
      timeSlots.some(
        (timeSlot) => timeSlot.value === manualSelectedTimeSlotValue
      );

    return hasManualSelected
      ? manualSelectedTimeSlotValue
      : defaultTimeSlot.value;
  }, [detailData, manualSelectedTimeSlotValue]);

  const selectedTimeSlot = useMemo<ReservationTimeSlotOption | null>(
    () =>
      detailData?.timeSlots.find(
        (timeSlot) => timeSlot.value === selectedTimeSlotValue
      ) ?? null,
    [detailData, selectedTimeSlotValue]
  );

  const selectedScheduleId = selectedTimeSlot?.scheduleId ?? null;

  const handleTimeSlotChange = (nextValue: string) => {
    setManualSelectedTimeSlotValue(nextValue);
  };

  return {
    selectedTimeSlotValue,
    selectedTimeSlot,
    selectedScheduleId,
    handleTimeSlotChange,
  };
};
