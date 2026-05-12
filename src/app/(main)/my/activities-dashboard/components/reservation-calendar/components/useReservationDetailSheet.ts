import { useEffect, useMemo, useRef, useState } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  fetchActivityReservations,
  updateActivityReservationStatus,
} from '@/app/(main)/my/activities-dashboard/apis/reservations';
import {
  EMPTY_TIME_SLOT,
  ReservationTab,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/reservationDetailSheet.constants';
import {
  ReservationDetailData,
  ReservationRequestItem,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';

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
  const queryClient = useQueryClient();
  const sheetRef = useRef<HTMLElement>(null);
  const requestScrollRef = useRef<HTMLDivElement>(null);
  const requestListEndRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<ReservationTab>('pending');
  const [manualSelectedTimeSlotValue, setManualSelectedTimeSlotValue] =
    useState<string | null>(null);
  const [nowTimestamp, setNowTimestamp] = useState(() => Date.now());
  const [feedbackModalMessage, setFeedbackModalMessage] = useState<
    string | null
  >(null);

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

    const intervalId = window.setInterval(() => {
      setNowTimestamp(Date.now());
    }, 60_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isOpen]);

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

  const selectedTimeSlotValue = useMemo(() => {
    const timeSlots = detailData?.timeSlots ?? [];
    if (!timeSlots.length) return EMPTY_TIME_SLOT;

    const hasManualSelected =
      manualSelectedTimeSlotValue !== null &&
      timeSlots.some(
        (timeSlot) => timeSlot.value === manualSelectedTimeSlotValue
      );

    return hasManualSelected ? manualSelectedTimeSlotValue : timeSlots[0].value;
  }, [detailData, manualSelectedTimeSlotValue]);

  const selectedTimeSlot = useMemo(
    () =>
      detailData?.timeSlots.find(
        (timeSlot) => timeSlot.value === selectedTimeSlotValue
      ) ?? null,
    [detailData, selectedTimeSlotValue]
  );

  const selectedScheduleId = selectedTimeSlot?.scheduleId ?? null;

  const isSelectedTimeSlotEnded = (() => {
    if (!selectedTimeSlot?.endTime) return false;

    const [hourString, minuteString] = selectedTimeSlot.endTime.split(':');
    const hour = Number(hourString);
    const minute = Number(minuteString);
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) return false;

    const endDateTime = new Date(selectedDate);
    endDateTime.setHours(hour, minute, 0, 0);

    return endDateTime.getTime() < nowTimestamp;
  })();

  const {
    data,
    isLoading: isLoadingRequests,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: [
      ...QUERY_KEYS.MY_ACTIVITY_RESERVATIONS,
      activityId,
      selectedScheduleId,
      activeTab,
    ],
    queryFn: ({ pageParam }) =>
      fetchActivityReservations({
        activityId,
        scheduleId: selectedScheduleId as number,
        status: activeTab,
        cursorId: pageParam as number | null,
      }),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => lastPage.cursorId ?? undefined,
    enabled: isOpen && selectedScheduleId !== null,
    refetchInterval: isOpen ? 60_000 : false,
  });

  const requests = useMemo<ReservationRequestItem[]>(() => {
    const baseRequests = data?.pages.flatMap((page) => page.reservations) ?? [];

    if (activeTab !== 'confirmed' || !isSelectedTimeSlotEnded) {
      return baseRequests;
    }

    return baseRequests.map((request) => ({
      ...request,
      status: 'completed',
    }));
  }, [activeTab, data, isSelectedTimeSlotEnded]);

  const hasMoreRequests = Boolean(hasNextPage);

  const { mutate: mutateReservationStatus, isPending: isUpdatingStatus } =
    useMutation({
      mutationFn: ({
        reservationId,
        status,
      }: {
        reservationId: number;
        status: 'confirmed' | 'declined';
      }) =>
        updateActivityReservationStatus({
          activityId,
          reservationId,
          status,
        }),
      onSuccess: async (_, variables) => {
        setFeedbackModalMessage(
          variables.status === 'confirmed'
            ? '승인이 완료되었습니다.'
            : '해당 예약신청을 거절했습니다.'
        );

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [...QUERY_KEYS.MY_ACTIVITY_RESERVATIONS, activityId],
          }),
          queryClient.invalidateQueries({
            queryKey: [...QUERY_KEYS.MY_ACTIVITY_RESERVED_SCHEDULE, activityId],
          }),
          queryClient.invalidateQueries({
            queryKey: [
              ...QUERY_KEYS.MY_ACTIVITY_RESERVATION_DASHBOARD,
              activityId,
            ],
          }),
        ]);
      },
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

  useEffect(() => {
    if (!hasMoreRequests) return;
    if (isFetchingNextPage) return;

    const observerTarget = requestListEndRef.current;
    if (!observerTarget) return;
    const scrollTarget = requestScrollRef.current;
    if (!scrollTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        fetchNextPage();
      },
      {
        root: scrollTarget,
        threshold: 0.2,
      }
    );

    observer.observe(observerTarget);
    return () => observer.disconnect();
  }, [fetchNextPage, hasMoreRequests, isFetchingNextPage]);

  const handleTimeSlotChange = (nextValue: string) => {
    setManualSelectedTimeSlotValue(nextValue);
  };

  const handleApproveReservation = (reservationId: number) => {
    mutateReservationStatus({
      reservationId,
      status: 'confirmed',
    });
  };

  const handleRejectReservation = (reservationId: number) => {
    mutateReservationStatus({
      reservationId,
      status: 'declined',
    });
  };

  const closeFeedbackModal = () => {
    setFeedbackModalMessage(null);
  };

  return {
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
    feedbackModalMessage,
    isDateReservationEmpty,
    handleTimeSlotChange,
    handleApproveReservation,
    handleRejectReservation,
    closeFeedbackModal,
    setActiveTab,
    sheetRef,
    shouldUseFixedRequestViewport,
    tabCount,
  };
};
