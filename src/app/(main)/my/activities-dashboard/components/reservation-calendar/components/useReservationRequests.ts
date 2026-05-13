import { useEffect, useMemo, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchActivityReservations } from '@/app/(main)/my/activities-dashboard/apis/reservations';
import type { ReservationTab } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/components/reservationDetailSheet.constants';
import type { ReservationRequestItem } from '@/app/(main)/my/activities-dashboard/components/reservation-calendar/reservationCalendar.types';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';

interface UseReservationRequestsParams {
  activityId: number;
  selectedScheduleId: number | null;
  activeTab: ReservationTab;
  isOpen: boolean;
  isSelectedTimeSlotEnded: boolean;
}

/**
 * 선택한 시간대의 예약 요청 목록 조회/가공/무한스크롤을 담당하는 훅
 */
export const useReservationRequests = ({
  activityId,
  selectedScheduleId,
  activeTab,
  isOpen,
  isSelectedTimeSlotEnded,
}: UseReservationRequestsParams) => {
  const requestScrollRef = useRef<HTMLDivElement>(null);
  const requestListEndRef = useRef<HTMLDivElement>(null);

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

  return {
    requests,
    isLoadingRequests,
    isFetchingNextPage,
    hasMoreRequests,
    requestScrollRef,
    requestListEndRef,
  };
};
