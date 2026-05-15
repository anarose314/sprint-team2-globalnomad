'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  CalendarValue,
  MobileSheetStep,
  TimeSlot,
} from '@/app/(main)/activity/[id]/components/activity-reservation-card/activityReservationCard.types';
import { useActivityReservationAvailability } from '@/app/(main)/activity/[id]/components/activity-reservation-card/hooks/useActivityReservationAvailability';
import { ApiError } from '@/shared/apis/apiError';
import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';
import type { ActivitySchedule } from '@/shared/types/activityDetail.types';
import { formatDateKey } from '@/shared/utils/formatDate';

interface UseActivityReservationCardStateProps {
  activityId: number;
  pricePerPerson: number;
  schedules: ActivitySchedule[];
}

export const useActivityReservationCardState = ({
  activityId,
  pricePerPerson,
  schedules,
}: UseActivityReservationCardStateProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [headCount, setHeadCount] = useState(1);
  const [reservedScheduleIds, setReservedScheduleIds] = useState<number[]>([]);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isLoginRequiredModalOpen, setIsLoginRequiredModalOpen] =
    useState(false);
  const [mobileSheetStep, setMobileSheetStep] =
    useState<MobileSheetStep>('dateTime');

  const { availableScheduleByDate } = useActivityReservationAvailability({
    activityId,
    schedules,
    reservedScheduleIds,
  });

  const availableDateKeys = useMemo(
    () => Object.keys(availableScheduleByDate).sort(),
    [availableScheduleByDate]
  );

  const hasSelectableDate = availableDateKeys.length > 0;
  const effectiveSelectedDateKey = selectedDateKey;

  const parsedSelectedDate = useMemo(() => {
    if (!effectiveSelectedDateKey) {
      return null;
    }

    const [year, month, day] = effectiveSelectedDateKey.split('-').map(Number);
    return new Date(year, month - 1, day);
  }, [effectiveSelectedDateKey]);

  const selectedDate = useMemo(() => parsedSelectedDate, [parsedSelectedDate]);

  const availableTimeSlots = useMemo<TimeSlot[]>(() => {
    if (!effectiveSelectedDateKey) {
      return [];
    }

    return availableScheduleByDate[effectiveSelectedDateKey] ?? [];
  }, [availableScheduleByDate, effectiveSelectedDateKey]);

  const activeSelectedTimeSlot = useMemo(() => {
    if (availableTimeSlots.length === 0) {
      return null;
    }

    if (!selectedTimeSlot) {
      return null;
    }

    return (
      availableTimeSlots.find((slot) => slot.id === selectedTimeSlot.id) ?? null
    );
  }, [availableTimeSlots, selectedTimeSlot]);

  const displayCurrentDate = useMemo(
    () => currentDate ?? selectedDate ?? new Date(),
    [currentDate, selectedDate]
  );

  const monthTitle = useMemo(
    () =>
      `${displayCurrentDate.getFullYear()}년 ${displayCurrentDate.getMonth() + 1}월`,
    [displayCurrentDate]
  );

  const totalPrice = useMemo(
    () => pricePerPerson * headCount,
    [headCount, pricePerPerson]
  );
  const isReservationAvailable = Boolean(
    activeSelectedTimeSlot && hasSelectableDate
  );

  const refreshAvailableSchedule = async () => {
    await queryClient.invalidateQueries({
      queryKey: [...QUERY_KEYS.ACTIVITY_AVAILABLE_SCHEDULE, activityId],
    });

    await queryClient.refetchQueries({
      queryKey: [...QUERY_KEYS.ACTIVITY_AVAILABLE_SCHEDULE, activityId],
      type: 'active',
    });
  };

  const { mutate: submitReservation, isPending: isReservationSubmitting } =
    useMutation({
      mutationFn: async () => {
        if (!activeSelectedTimeSlot) {
          return;
        }

        await fetchInstanceClient(
          `/api/proxy/activities/${activityId}/reservations`,
          {
            method: 'POST',
            body: {
              scheduleId: activeSelectedTimeSlot.id,
              headCount,
            },
          }
        );
      },
      onSuccess: async () => {
        if (activeSelectedTimeSlot) {
          setReservedScheduleIds((prev) =>
            prev.includes(activeSelectedTimeSlot.id)
              ? prev
              : [...prev, activeSelectedTimeSlot.id]
          );
        }

        await refreshAvailableSchedule();

        setSelectedDateKey(null);
        setSelectedTimeSlot(null);
        setHeadCount(1);
        setIsDateSheetOpen(false);
        setIsSuccessModalOpen(true);
      },
      onError: async (error) => {
        if (error instanceof ApiError && error.status === 401) {
          setIsLoginRequiredModalOpen(true);
          return;
        }

        if (!(error instanceof ApiError) || error.status !== 409) {
          return;
        }

        if (activeSelectedTimeSlot) {
          setReservedScheduleIds((prev) =>
            prev.includes(activeSelectedTimeSlot.id)
              ? prev
              : [...prev, activeSelectedTimeSlot.id]
          );
        }

        setSelectedTimeSlot(null);
        await refreshAvailableSchedule();
      },
    });

  const selectedDateText = useMemo(() => {
    if (!selectedDate) {
      return '-';
    }
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  }, [selectedDate]);

  const handleOpenDateSheet = () => {
    setMobileSheetStep('dateTime');
    if (parsedSelectedDate) {
      setCurrentDate(
        new Date(
          parsedSelectedDate.getFullYear(),
          parsedSelectedDate.getMonth(),
          1
        )
      );
    }
    setIsDateSheetOpen(true);
  };

  const handleCloseDateSheet = () => {
    setIsDateSheetOpen(false);
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  const handleCloseLoginRequiredModal = () => {
    setIsLoginRequiredModalOpen(false);
  };

  const handleConfirmLoginRequired = () => {
    setIsLoginRequiredModalOpen(false);
    router.push('/login');
  };

  const handleMoveToHeadCountStep = () => {
    setMobileSheetStep('headCount');
  };

  const handleMoveToDateTimeStep = () => {
    setMobileSheetStep('dateTime');
  };

  const handleDecreaseHeadCount = () => {
    setHeadCount((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseHeadCount = () => {
    setHeadCount((prev) => prev + 1);
  };

  const handleSelectTimeSlot = (slot: TimeSlot) => () => {
    setSelectedTimeSlot(slot);
  };

  const handleDateChange = (value: CalendarValue) => {
    if (value instanceof Date) {
      const newDateKey = formatDateKey(value);

      if (newDateKey === selectedDateKey) {
        return;
      }

      setSelectedDateKey(newDateKey);
      setCurrentDate(new Date(value.getFullYear(), value.getMonth(), 1));
      setSelectedTimeSlot(null);
    }
  };

  const handleMonthChange = (activeStartDate?: Date | null) => {
    if (activeStartDate) {
      setCurrentDate(activeStartDate);
    }
  };

  const handleSubmitReservation = () => {
    if (!isReservationAvailable || isReservationSubmitting) {
      return;
    }
    submitReservation();
  };

  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') {
      return false;
    }

    const dateKey = formatDateKey(date);
    return !Boolean(availableScheduleByDate[dateKey]);
  };

  return {
    isDateSheetOpen,
    isSuccessModalOpen,
    isLoginRequiredModalOpen,
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
    handleCloseLoginRequiredModal,
    handleConfirmLoginRequired,
    handleMoveToHeadCountStep,
    handleMoveToDateTimeStep,
    handleDateChange,
    handleMonthChange,
    handleSelectTimeSlot,
    handleDecreaseHeadCount,
    handleIncreaseHeadCount,
    handleSubmitReservation,
    tileDisabled,
  };
};
