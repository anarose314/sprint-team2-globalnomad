'use client';

import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { useSearchParams } from 'next/navigation';
import type {
  ActivityCategory,
  ActivitySort,
} from '@/app/(main)/activity/apis/activities.types';
import { useActivities } from '@/app/(main)/activity/hooks/useActivities';
import { ActivityCard } from '@/app/(main)/components/activity-card';
import { ActivityCardListSkeleton } from '@/app/(main)/components/activity-card-list-skeleton';
import { ActivitySectionStatus } from '@/app/(main)/components/activity-section-status';
import type { AllActivitySectionProps } from '@/app/(main)/components/all-activity-section/allActivitySection.types';
import { useUpdateSearchParams } from '@/app/(main)/hooks/useUpdateSearchParams';
import {
  MAIN_DESKTOP_PAGE_SIZE,
  MAIN_DESKTOP_PAGE_SIZE_MEDIA_QUERY,
  MAIN_PAGE_SIZE,
  MAIN_SORT_OPTIONS,
} from '@/app/(main)/main.constants';
import { MAIN_CATEGORIES } from '@/app/(main)/mainCategories.constants';
import { FilterButton } from '@/shared/components/buttons';
import { Dropdown } from '@/shared/components/dropdown';
import { Heading } from '@/shared/components/heading';
import { Pagination } from '@/shared/components/pagination';
import { useDragScroll } from '@/shared/hooks/useDragScroll';
import { cn } from '@/shared/utils/cn';

const getDesktopPageSizeSnapshot = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia(MAIN_DESKTOP_PAGE_SIZE_MEDIA_QUERY).matches;
};

const getServerDesktopPageSizeSnapshot = () => false;

const isActivityCategory = (value: string): value is ActivityCategory => {
  return MAIN_CATEGORIES.some((category) => category.apiValue === value);
};

const isActivitySort = (value: string): value is ActivitySort => {
  return (
    value === 'latest' ||
    MAIN_SORT_OPTIONS.some((option) => option.value === value)
  );
};

const parsePageParam = (value: string | null) => {
  const page = Number(value);

  return Number.isInteger(page) && page > 0 ? page : 1;
};

const ACTIVITY_GRID_CLASS_NAME = cn(
  'grid w-full grid-cols-1 gap-4 gap-y-6',
  'xs:grid-cols-2',
  'md:grid-cols-3 md:gap-6',
  '2xl:grid-cols-4'
);

/**
 * 메인 페이지 모든 체험 섹션 컴포넌트
 *
 * - 검색어, 카테고리, 가격 정렬 조건으로 모든 체험 목록을 조회한다.
 * - 검색 시 카테고리와 가격 정렬 조건은 초기화된다.
 * - 카테고리와 가격 정렬은 함께 적용할 수 있다.
 * - 페이지, 카테고리, 정렬 상태를 URL query string과 동기화한다.
 *
 * @example
 * <AllActivitySection
 *   keyword={keyword}
 *   onResetSearchInput={handleResetSearchInput}
 * />
 */
export function AllActivitySection({
  keyword,
  isSearchMode = false,
  onResetSearchInput,
}: AllActivitySectionProps) {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();

  const { scrollRef, events } = useDragScroll<HTMLUListElement>();

  const subscribeDesktopPageSize = useCallback((onStoreChange: () => void) => {
    if (typeof window === 'undefined') {
      return () => undefined;
    }

    const mediaQuery = window.matchMedia(MAIN_DESKTOP_PAGE_SIZE_MEDIA_QUERY);

    mediaQuery.addEventListener('change', onStoreChange);

    return () => {
      mediaQuery.removeEventListener('change', onStoreChange);
    };
  }, []);

  const isDesktopPageSize = useSyncExternalStore(
    subscribeDesktopPageSize,
    getDesktopPageSizeSnapshot,
    getServerDesktopPageSizeSnapshot
  );

  const previousIsDesktopPageSizeRef = useRef(isDesktopPageSize);

  useEffect(() => {
    if (previousIsDesktopPageSizeRef.current === isDesktopPageSize) {
      return;
    }

    previousIsDesktopPageSizeRef.current = isDesktopPageSize;

    updateSearchParams((params) => {
      params.delete('page');
    });
  }, [isDesktopPageSize, updateSearchParams]);

  const pageSize = isDesktopPageSize ? MAIN_DESKTOP_PAGE_SIZE : MAIN_PAGE_SIZE;
  const currentPage = parsePageParam(searchParams.get('page'));

  const categoryParam = searchParams.get('category');
  const selectedCategory =
    categoryParam && isActivityCategory(categoryParam)
      ? categoryParam
      : undefined;

  const sortParam = searchParams.get('sort');
  const selectedSort =
    sortParam && isActivitySort(sortParam) ? sortParam : 'latest';

  const { data, isPending, isError } = useActivities({
    method: 'offset',
    page: currentPage,
    size: pageSize,
    sort: selectedSort,
    category: isSearchMode ? undefined : selectedCategory,
    keyword,
  });

  const activities = data?.activities ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = data ? Math.ceil(data.totalCount / pageSize) : 0;

  const handleAllCategoryClick = () => {
    updateSearchParams((params) => {
      params.delete('category');
      params.delete('keyword');
      params.delete('page');
    });

    onResetSearchInput();
  };

  const handleCategoryClick = (category: ActivityCategory) => {
    updateSearchParams((params) => {
      if (selectedCategory === category) {
        params.delete('category');
      } else {
        params.set('category', category);
      }

      params.delete('keyword');
      params.delete('page');
    });

    onResetSearchInput();
  };

  const handleSortChange = (value: string) => {
    if (!isActivitySort(value)) {
      return;
    }

    updateSearchParams((params) => {
      if (value === 'latest') {
        params.delete('sort');
      } else {
        params.set('sort', value);
      }

      if (!isSearchMode) {
        params.delete('keyword');
      }

      params.delete('page');
    });

    if (!isSearchMode) {
      onResetSearchInput();
    }
  };

  const handlePageChange = (nextPage: number) => {
    updateSearchParams((params) => {
      if (nextPage === 1) {
        params.delete('page');
      } else {
        params.set('page', String(nextPage));
      }
    });
  };

  return (
    <section>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Heading
            as="h2"
            textStyle={isSearchMode ? 'typo-2lg-medium' : 'typo-2lg-bold'}
            className={cn(
              'text-gray-950',
              isSearchMode
                ? 'md:typo-xl-medium 2xl:typo-xl-medium'
                : 'md:typo-2xl-bold 2xl:typo-3xl-bold'
            )}
          >
            {isSearchMode ? (
              <>
                검색결과 :{' '}
                <span className="typo-2lg-bold md:typo-xl-bold 2xl:typo-xl-bold">
                  {keyword}
                </span>
              </>
            ) : (
              '모든 체험'
            )}
          </Heading>

          {isSearchMode && !isPending && !isError && (
            <p className="typo-2lg-medium text-gray-700">
              총 {totalCount.toLocaleString()}개의 결과
            </p>
          )}
        </div>

        <Dropdown
          variant="chip"
          options={MAIN_SORT_OPTIONS}
          value={selectedSort === 'latest' ? undefined : selectedSort}
          placeholder="정렬"
          onChange={handleSortChange}
          menuClassName="left-auto right-0"
        />
      </div>

      {!isSearchMode && (
        <ul
          ref={scrollRef}
          {...events}
          className="scrollbar-hide mb-5 flex cursor-grab gap-3 overflow-x-auto select-none active:cursor-grabbing"
        >
          <li className="shrink-0">
            <FilterButton
              label="전체"
              state={!selectedCategory ? 'active' : 'normal'}
              className="whitespace-nowrap"
              onClick={handleAllCategoryClick}
            />
          </li>

          {MAIN_CATEGORIES.map((category) => (
            <li key={category.value} className="shrink-0">
              <FilterButton
                label={category.label}
                icon={<category.Icon />}
                state={
                  selectedCategory === category.apiValue ? 'active' : 'normal'
                }
                className="whitespace-nowrap"
                onClick={() => handleCategoryClick(category.apiValue)}
              />
            </li>
          ))}
        </ul>
      )}

      {isPending && (
        <ActivityCardListSkeleton
          count={pageSize}
          className={ACTIVITY_GRID_CLASS_NAME}
          message="모든 체험 목록을 불러오는 중입니다."
        />
      )}

      {isError && (
        <ActivitySectionStatus
          message="체험을 불러오지 못했습니다."
          tone="error"
        />
      )}

      {!isPending && !isError && activities.length === 0 && (
        <ActivitySectionStatus
          message={
            isSearchMode
              ? '검색 결과가 없습니다.'
              : '조건에 맞는 체험이 없습니다.'
          }
        />
      )}

      {!isPending && !isError && activities.length > 0 && (
        <>
          <ul className={ACTIVITY_GRID_CLASS_NAME}>
            {activities.map((activity) => (
              <li key={activity.id}>
                <ActivityCard activity={activity} />
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="mt-10">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}
