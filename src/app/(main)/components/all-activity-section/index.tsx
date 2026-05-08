'use client';

import { useState } from 'react';
import { ActivityCard } from '@/app/(main)/components/activity-card';
import {
  MAIN_ACTIVITIES,
  MAIN_ACTIVITY_GRID_CLASS,
  MAIN_CATEGORIES,
  MAIN_SORT_OPTIONS,
} from '@/app/(main)/main.constants';
import { FilterButton } from '@/shared/components/buttons';
import { Dropdown } from '@/shared/components/dropdown';
import { Heading } from '@/shared/components/heading';
import { Pagination } from '@/shared/components/pagination';

const TEMP_TOTAL_PAGES = 5;

/**
 * 메인 페이지 모든 체험 섹션 컴포넌트
 *
 * - 모든 체험 영역의 제목, 정렬 드롭다운, 카테고리 필터 UI를 표시한다.
 * - 현재 UI 단계에서는 선택 상태와 필터링/정렬 로직을 포함하지 않는다.
 *
 * @example
 * <AllActivitySection />
 */
export function AllActivitySection() {
  const [currentPage, setCurrentPage] = useState(1);

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
          // TODO: 추후 정렬 기능 연동 예정
        />
      </div>
      <ul className="scrollbar-hide mb-5 flex gap-3 overflow-x-auto">
        {MAIN_CATEGORIES.map((category) => (
          <li key={category.value} className="shrink-0">
            <FilterButton
              label={category.label}
              category={category.iconCategory}
              className="whitespace-nowrap"
            />
          </li>
        ))}
      </ul>

      <ul className={MAIN_ACTIVITY_GRID_CLASS}>
        {MAIN_ACTIVITIES.map((activity) => (
          <li key={activity.id}>
            <ActivityCard activity={activity} />
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <Pagination
          currentPage={currentPage}
          totalPages={TEMP_TOTAL_PAGES}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  );
}
