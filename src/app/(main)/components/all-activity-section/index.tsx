'use client';

import { useEffect, useState } from 'react';
import { useActivities } from '@/app/(main)/activity/hooks/useActivities';
import { ActivityCard } from '@/app/(main)/components/activity-card';
import {
  MAIN_CATEGORIES,
  MAIN_DESKTOP_PAGE_SIZE,
  MAIN_DESKTOP_PAGE_SIZE_MEDIA_QUERY,
  MAIN_PAGE_SIZE,
  MAIN_SORT_OPTIONS,
} from '@/app/(main)/main.constants';
import { FilterButton } from '@/shared/components/buttons';
import { Dropdown } from '@/shared/components/dropdown';
import { Heading } from '@/shared/components/heading';
import { Pagination } from '@/shared/components/pagination';
import { cn } from '@/shared/utils/cn';

/**
 * 메인 페이지 모든 체험 섹션 컴포넌트
 *
 * - 모든 체험 목록을 최신순 페이지네이션으로 조회한다.
 * - 모바일~태블릿에서는 한 페이지에 6개, 2xl 화면에서는 8개를 조회한다.
 * - PR1에서는 카테고리 필터와 가격 정렬 UI만 표시한다.
 * - 검색, 카테고리, 가격 정렬 동작은 이후 작업에서 연결한다.
 *
 * @example
 * <AllActivitySection />
 */
export function AllActivitySection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(MAIN_PAGE_SIZE);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MAIN_DESKTOP_PAGE_SIZE_MEDIA_QUERY);

    const updatePageSize = () => {
      const nextPageSize = mediaQuery.matches
        ? MAIN_DESKTOP_PAGE_SIZE
        : MAIN_PAGE_SIZE;

      setPageSize(nextPageSize);
      setCurrentPage(1);
    };

    updatePageSize();

    mediaQuery.addEventListener('change', updatePageSize);

    return () => {
      mediaQuery.removeEventListener('change', updatePageSize);
    };
  }, []);

  const { data, isPending, isError } = useActivities({
    method: 'offset',
    page: currentPage,
    size: pageSize,
    sort: 'latest',
  });

  const activities = data?.activities ?? [];
  const totalPages = data ? Math.ceil(data.totalCount / pageSize) : 0;

  return (
    <section>
      <div className="mb-5 flex items-center justify-between gap-4">
        <Heading
          as="h2"
          textStyle="typo-2lg-bold"
          className="2xl:typo-3xl-bold md:typo-2xl-bold text-gray-950"
        >
          모든 체험
        </Heading>

        <Dropdown
          variant="chip"
          options={MAIN_SORT_OPTIONS}
          placeholder="정렬"
          onChange={() => undefined}
          menuClassName="left-auto right-0"
          // TODO: 가격 정렬 기능은 PR2에서 연결 예정
        />
      </div>

      <ul className="scrollbar-hide mb-5 flex gap-3 overflow-x-auto">
        {MAIN_CATEGORIES.map((category) => (
          <li key={category.value} className="shrink-0">
            <FilterButton
              label={category.label}
              category={category.iconCategory}
              className="whitespace-nowrap"
              // TODO: 카테고리 필터 기능은 PR2에서 연결 예정
            />
          </li>
        ))}
      </ul>

      {isPending && (
        <p className="typo-md-medium py-10 text-center text-gray-500">
          체험을 불러오는 중입니다.
        </p>
      )}

      {isError && (
        <p className="typo-md-medium py-10 text-center text-red-500">
          체험을 불러오지 못했습니다.
        </p>
      )}

      {!isPending && !isError && activities.length === 0 && (
        <p className="typo-md-medium py-10 text-center text-gray-500">
          등록된 체험이 없습니다.
        </p>
      )}

      {!isPending && !isError && activities.length > 0 && (
        <>
          <ul
            className={cn(
              'grid w-full grid-cols-1 gap-4 gap-y-6',
              'xs:grid-cols-2',
              'md:grid-cols-3 md:gap-6',
              '2xl:grid-cols-4'
            )}
          >
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
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}
