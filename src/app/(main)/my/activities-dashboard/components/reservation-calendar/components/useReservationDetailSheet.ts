import { useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchActivityReservations } from '@/app/(main)/my/activities-dashboard/apis/reservations';
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
  detailData?: ReservationDetailData;
  onClose: () => void;
}

/**
 * 예약 상세 패널의 상태/파생값/이벤트 사이드이펙트를 캡슐화
 */
export const useReservationDetailSheet = ({
  activityId,
  isOpen,
  detailData,
  onClose,
}: UseReservationDetailSheetParams) => {
  const sheetRef = useRef<HTMLElement>(null);
  const requestScrollRef = useRef<HTMLDivElement>(null);
  const requestListEndRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<ReservationTab>('pending');
  const [manualSelectedTimeSlotValue, setManualSelectedTimeSlotValue] =
    useState<string | null>(null);

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
  });

  const requests = useMemo<ReservationRequestItem[]>(
    () =>
      (data?.pages.flatMap((page) => page.reservations) ?? [])
        .slice()
        .sort((a, b) => {
          const createdAtA = Date.parse(a.createdAt);
          const createdAtB = Date.parse(b.createdAt);

          if (Number.isNaN(createdAtA) || Number.isNaN(createdAtB)) {
            return b.id - a.id;
          }

          return createdAtB - createdAtA;
        }),
    [data]
  );

  const hasMoreRequests = Boolean(hasNextPage);

  const tabCount = useMemo(() => {
    return selectedTimeSlot?.count ?? { pending: 0, confirmed: 0, declined: 0 };
  }, [selectedTimeSlot]);

  const shouldUseFixedRequestViewport = useMemo(
    () => Object.values(tabCount).some((count) => count >= 2),
    [tabCount]
  );

  useEffect(() => {
    if (!hasMoreRequests) return;
    if (isFetchingNextPage) return;

    const observerTarget = requestListEndRef.current;
    if (!observerTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        fetchNextPage();
      },
      {
        root: requestScrollRef.current,
        threshold: 0.2,
      }
    );

    observer.observe(observerTarget);
    return () => observer.disconnect();
  }, [fetchNextPage, hasMoreRequests, isFetchingNextPage]);

  const handleTimeSlotChange = (nextValue: string) => {
    setManualSelectedTimeSlotValue(nextValue);
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
    handleTimeSlotChange,
    setActiveTab,
    sheetRef,
    shouldUseFixedRequestViewport,
    tabCount,
  };
};
