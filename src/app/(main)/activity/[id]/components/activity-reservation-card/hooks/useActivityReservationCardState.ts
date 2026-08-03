'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  CalendarValue,
  MobileSheetStep,
  TimeSlot,
  TimeSlotWithStatus,
} from '@/app/(main)/activity/[id]/components/activity-reservation-card/activityReservationCard.types';
import { useActivityReservationAvailability } from '@/app/(main)/activity/[id]/components/activity-reservation-card/hooks/useActivityReservationAvailability';
import { isUpcomingTimeSlot } from '@/app/(main)/activity/[id]/components/activity-reservation-card/utils/reservationDateTime';
import { ApiError } from '@/shared/apis/apiError';
import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';
import { reservationKeys } from '@/shared/queryKeys/reservationKeys';
import { useShowToast } from '@/shared/store/useToastStore';
import type { ActivitySchedule } from '@/shared/types/activityDetail.types';
import { formatDateKey } from '@/shared/utils/formatDate';

interface UseActivityReservationCardStateProps {
  activityId: number;
  pricePerPerson: number;
  schedules: ActivitySchedule[];
  isAuthenticated: boolean;
}

export const useActivityReservationCardState = ({
  activityId,
  pricePerPerson,
  schedules,
  isAuthenticated,
}: UseActivityReservationCardStateProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const showToast = useShowToast();
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

  const { scheduleByDate } = useActivityReservationAvailability({
    activityId,
    schedules,
    reservedScheduleIds,
    isAuthenticated,
  });

  const scheduleDateKeys = useMemo(
    () => Object.keys(scheduleByDate).sort(),
    [scheduleByDate]
  );

  const hasBookableSlot = useMemo(
    () =>
      Object.values(scheduleByDate).some((slots) =>
        slots.some((slot) => slot.status === 'available')
      ),
    [scheduleByDate]
  );

  const scheduleDateKeysSignature = scheduleDateKeys.join(',');

  useEffect(() => {
    if (!scheduleDateKeysSignature) {
      return;
    }

    const earliestDateKey = scheduleDateKeys[0];
    if (!earliestDateKey) {
      return;
    }

    const now = new Date();
    const todayKey = formatDateKey(now);

    if (earliestDateKey !== todayKey) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      setSelectedDateKey((prev) => (prev !== null ? prev : todayKey));

      setCurrentDate((prev) => {
        if (prev !== null) {
          return prev;
        }

        return new Date(now.getFullYear(), now.getMonth(), 1);
      });
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [scheduleDateKeys]);
  const effectiveSelectedDateKey = selectedDateKey;

  const parsedSelectedDate = useMemo(() => {
    if (!effectiveSelectedDateKey) {
      return null;
    }

    const [year, month, day] = effectiveSelectedDateKey.split('-').map(Number);
    return new Date(year, month - 1, day);
  }, [effectiveSelectedDateKey]);

  const selectedDate = useMemo(() => parsedSelectedDate, [parsedSelectedDate]);

  const timeSlots = useMemo<TimeSlotWithStatus[]>(() => {
    if (!effectiveSelectedDateKey) {
      return [];
    }

    return scheduleByDate[effectiveSelectedDateKey] ?? [];
  }, [scheduleByDate, effectiveSelectedDateKey]);

  /**
   * 선택한 시간대가 데이터 갱신 후 예약 불가 상태(`mine`/`unavailable`)로 바뀌면
   * 선택을 해제하기 위해 최신 timeSlots에서 `available` 상태만 유효한 선택으로 인정한다.
   */
  const activeSelectedTimeSlot = useMemo<TimeSlot | null>(() => {
    if (!selectedTimeSlot) {
      return null;
    }

    const matchedSlot = timeSlots.find(
      (slot) => slot.id === selectedTimeSlot.id
    );

    if (!matchedSlot || matchedSlot.status !== 'available') {
      return null;
    }

    return {
      id: matchedSlot.id,
      startTime: matchedSlot.startTime,
      endTime: matchedSlot.endTime,
    };
  }, [timeSlots, selectedTimeSlot]);

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
  const isReservationAvailable = Boolean(activeSelectedTimeSlot);

  const refreshAvailableSchedule = async () => {
    const queryKey = reservationKeys.availableSchedule.byActivity(activityId);

    await queryClient.invalidateQueries({ queryKey });
    await queryClient.refetchQueries({ queryKey, type: 'active' });
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
            skipSessionExpiredRedirect: true,
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

        /**
         * 409는 "내가 예약했다"가 아니라 "이 시간대가 더 이상 예약 가능하지 않다"는 뜻이므로
         * reservedScheduleIds(=내 예약)에 넣지 않는다. 선택만 해제하고 최신 예약 가능 목록을
         * 다시 받아오면 해당 슬롯은 자연히 unavailable로 반영된다.
         */
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
    router.push(`/login?from=${encodeURIComponent(pathname)}`);
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
    if (!activeSelectedTimeSlot || isReservationSubmitting) {
      return;
    }

    if (
      !effectiveSelectedDateKey ||
      !isUpcomingTimeSlot(
        effectiveSelectedDateKey,
        activeSelectedTimeSlot.startTime,
        new Date()
      )
    ) {
      setSelectedTimeSlot(null);
      showToast({
        theme: 'warning',
        message:
          '선택한 시간이 지나 예약할 수 없습니다. 다른 시간을 선택해주세요.',
      });
      return;
    }

    submitReservation();
  };

  /**
   * 원본 일정이 있는 날짜는 예약 가능한 시간이 없어도 선택해 시간표를 확인할 수 있도록,
   * 스케줄 존재 여부만으로 판단한다(예약 가능 여부는 시간대 단위에서 개별적으로 표시).
   */
  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') {
      return false;
    }

    const dateKey = formatDateKey(date);
    return !Boolean(scheduleByDate[dateKey]);
  };

  return {
    isDateSheetOpen,
    isSuccessModalOpen,
    isLoginRequiredModalOpen,
    mobileSheetStep,
    hasBookableSlot,
    isReservationAvailable,
    isReservationSubmitting,
    selectedDate,
    displayCurrentDate,
    monthTitle,
    selectedDateText,
    activeSelectedTimeSlot,
    timeSlots,
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
