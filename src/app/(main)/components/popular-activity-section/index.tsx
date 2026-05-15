'use client';

import {
  type UIEvent,
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { usePopularActivitiesInfinite } from '@/app/(main)/activity/hooks/usePopularActivitiesInfinite';
import { ActivityCard } from '@/app/(main)/components/activity-card';
import { ActivityCardListSkeleton } from '@/app/(main)/components/activity-card-list-skeleton';
import { ActivitySectionStatus } from '@/app/(main)/components/activity-section-status';
import {
  MAIN_DESKTOP_PAGE_SIZE_MEDIA_QUERY,
  POPULAR_ACTIVITY_PAGE_SIZE,
} from '@/app/(main)/main.constants';
import { Heading } from '@/shared/components/heading';
import { useDragScroll } from '@/shared/hooks/useDragScroll';
import { cn } from '@/shared/utils/cn';

const SCROLL_LOAD_THRESHOLD = 80;

const POPULAR_ACTIVITY_LIST_CLASS_NAME = cn(
  'scrollbar-hide grid grid-flow-col overflow-x-auto pb-4 select-none',
  'cursor-grab active:cursor-grabbing 2xl:cursor-auto 2xl:active:cursor-auto',
  '-mx-6 auto-cols-[calc((100%-1rem)/1.15)] gap-4 px-6',
  'xs:auto-cols-[calc((100%-1rem)/2.1)]',
  'md:-mr-7.5 md:ml-0 md:auto-cols-[calc((100%-3rem)/3)] md:gap-6 md:pr-7.5 md:pl-0',
  '2xl:mx-0 2xl:auto-cols-auto 2xl:grid-flow-row 2xl:grid-cols-4 2xl:overflow-visible 2xl:px-0'
);

const subscribeDesktopLayout = (onStoreChange: () => void) => {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const mediaQuery = window.matchMedia(MAIN_DESKTOP_PAGE_SIZE_MEDIA_QUERY);

  mediaQuery.addEventListener('change', onStoreChange);

  return () => {
    mediaQuery.removeEventListener('change', onStoreChange);
  };
};

const getDesktopLayoutSnapshot = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia(MAIN_DESKTOP_PAGE_SIZE_MEDIA_QUERY).matches;
};

const getServerDesktopLayoutSnapshot = () => false;

/**
 * 메인 페이지 인기 체험 섹션 컴포넌트
 *
 * - 댓글 수가 많은 순으로 인기 체험 목록을 조회한다.
 * - 모바일/태블릿에서는 가로 스크롤 끝에 도달하면 다음 목록을 불러온다.
 * - 모바일/태블릿에서는 마우스 드래그로도 가로 스크롤할 수 있다.
 * - 데스크탑에서는 화살표 버튼 클릭 시 인기 체험 묶음을 이동한다.
 * - 마지막 응답이 빈 배열인 경우 마지막으로 데이터가 있던 목록을 유지한다.
 *
 * @example
 * <PopularActivitySection />
 */
export function PopularActivitySection() {
  const [desktopPageIndex, setDesktopPageIndex] = useState(0);
  const isLoadNextPageLockedRef = useRef(false);
  const { scrollRef, events } = useDragScroll<HTMLUListElement>();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = usePopularActivitiesInfinite();

  const isDesktopLayout = useSyncExternalStore(
    subscribeDesktopLayout,
    getDesktopLayoutSnapshot,
    getServerDesktopLayoutSnapshot
  );

  const pages = data?.pages ?? [];
  const allActivities = pages.flatMap((page) => page.activities);
  const desktopPages = pages.filter((page) => page.activities.length > 0);
  const totalCount = pages[0]?.totalCount ?? 0;
  const hasLoadedAllActivities =
    totalCount > 0 && allActivities.length >= totalCount;

  const safeDesktopPageIndex = Math.min(
    desktopPageIndex,
    Math.max(desktopPages.length - 1, 0)
  );

  const desktopActivities =
    desktopPages[safeDesktopPageIndex]?.activities ?? [];

  const activities = isDesktopLayout ? desktopActivities : allActivities;

  const canLoadNextPage =
    Boolean(hasNextPage) && !isFetchingNextPage && !hasLoadedAllActivities;

  const canMovePreviousDesktopPage =
    isDesktopLayout && safeDesktopPageIndex > 0;

  const canMoveNextDesktopPage =
    isDesktopLayout &&
    (safeDesktopPageIndex < desktopPages.length - 1 || canLoadNextPage);

  const shouldShowPreviousButton = canMovePreviousDesktopPage;
  const shouldShowNextButton = canMoveNextDesktopPage;

  const loadNextPage = useCallback(async () => {
    if (!canLoadNextPage || isLoadNextPageLockedRef.current) return null;

    isLoadNextPageLockedRef.current = true;

    try {
      return await fetchNextPage();
    } finally {
      isLoadNextPageLockedRef.current = false;
    }
  }, [canLoadNextPage, fetchNextPage]);

  const handlePreviousButtonClick = () => {
    setDesktopPageIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNextButtonClick = async () => {
    if (!isDesktopLayout) {
      await loadNextPage();
      return;
    }

    const nextPageIndex = safeDesktopPageIndex + 1;

    if (desktopPages[nextPageIndex]) {
      setDesktopPageIndex(nextPageIndex);
      return;
    }

    const result = await loadNextPage();
    const nextDesktopPages =
      result?.data?.pages.filter((page) => page.activities.length > 0) ?? [];

    if (nextDesktopPages[nextPageIndex]) {
      setDesktopPageIndex(nextPageIndex);
    }
  };

  const handleHorizontalScroll = (event: UIEvent<HTMLUListElement>) => {
    if (isDesktopLayout) return;

    const { scrollLeft, scrollWidth, clientWidth } = event.currentTarget;
    const isNearEnd =
      scrollLeft + clientWidth >= scrollWidth - SCROLL_LOAD_THRESHOLD;

    if (isNearEnd) {
      void loadNextPage();
    }
  };

  return (
    <section>
      <Heading
        as="h2"
        textStyle="typo-2lg-bold"
        className="2xl:typo-3xl-bold md:typo-2xl-bold mb-6 text-gray-950"
      >
        인기 체험
      </Heading>

      {isPending && (
        <ActivityCardListSkeleton
          count={POPULAR_ACTIVITY_PAGE_SIZE}
          className={POPULAR_ACTIVITY_LIST_CLASS_NAME}
          message="인기 체험 목록을 불러오는 중입니다."
        />
      )}

      {isError && (
        <ActivitySectionStatus
          message="인기 체험을 불러오지 못했습니다."
          tone="error"
        />
      )}

      {!isPending && !isError && activities.length === 0 && (
        <ActivitySectionStatus message="인기 체험이 없습니다." />
      )}

      {!isPending && !isError && activities.length > 0 && (
        <div className="relative">
          <ul
            ref={scrollRef}
            onScroll={handleHorizontalScroll}
            {...events}
            className={POPULAR_ACTIVITY_LIST_CLASS_NAME}
          >
            {activities.map((activity) => (
              <li key={activity.id} className="w-full">
                <ActivityCard activity={activity} />
              </li>
            ))}
          </ul>

          {shouldShowPreviousButton && (
            <button
              type="button"
              onClick={handlePreviousButtonClick}
              aria-label="이전 인기 체험 보기"
              className="shadow-card absolute top-1/2 left-0 hidden h-13.5 w-13.5 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white 2xl:flex"
            >
              <span
                aria-hidden="true"
                className="h-3 w-3 rotate-45 border-b-2 border-l-2 border-gray-950"
              />
            </button>
          )}

          {shouldShowNextButton && (
            <button
              type="button"
              onClick={handleNextButtonClick}
              aria-label="인기 체험 더 불러오기"
              className="shadow-card absolute top-1/2 right-0 hidden h-13.5 w-13.5 translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white 2xl:flex"
            >
              <span
                aria-hidden="true"
                className="h-3 w-3 rotate-45 border-t-2 border-r-2 border-gray-950"
              />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
