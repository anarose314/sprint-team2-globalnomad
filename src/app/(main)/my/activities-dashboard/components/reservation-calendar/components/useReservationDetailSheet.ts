import { useEffect, useMemo, useRef, useState } from 'react';
import {
  EMPTY_TIME_SLOT,
  REQUESTS_PAGE_SIZE,
  ReservationTab,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/reservationDetailSheet.constants';
import {
  ReservationDetailMockData,
  ReservationRequestItem,
} from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';

interface UseReservationDetailSheetParams {
  isOpen: boolean;
  detailData?: ReservationDetailMockData;
  onClose: () => void;
}

/**
 * 예약 상세 패널의 상태/파생값/이벤트 사이드이펙트를 캡슐화
 */
export const useReservationDetailSheet = ({
  isOpen,
  detailData,
  onClose,
}: UseReservationDetailSheetParams) => {
  const sheetRef = useRef<HTMLElement>(null);
  const requestScrollRef = useRef<HTMLDivElement>(null);
  const requestListEndRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<ReservationTab>('pending');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(
    detailData?.timeSlots[0] ?? EMPTY_TIME_SLOT
  );
  const [visibleRequestCount, setVisibleRequestCount] =
    useState(REQUESTS_PAGE_SIZE);

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
    const base = { pending: 0, confirmed: 0, declined: 0 };
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

  const visibleRequests = useMemo<ReservationRequestItem[]>(
    () => filteredRequests.slice(0, visibleRequestCount),
    [filteredRequests, visibleRequestCount]
  );

  const hasMoreRequests = visibleRequests.length < filteredRequests.length;
  const shouldUseFixedRequestViewport = useMemo(
    () => Object.values(tabCount).some((count) => count >= 2),
    [tabCount]
  );

  useEffect(() => {
    if (!hasMoreRequests) return;

    const observerTarget = requestListEndRef.current;
    if (!observerTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setVisibleRequestCount((previousCount) =>
          Math.min(previousCount + REQUESTS_PAGE_SIZE, filteredRequests.length)
        );
      },
      {
        root: requestScrollRef.current,
        threshold: 0.2,
      }
    );

    observer.observe(observerTarget);
    return () => observer.disconnect();
  }, [filteredRequests.length, hasMoreRequests]);

  return {
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
  };
};
