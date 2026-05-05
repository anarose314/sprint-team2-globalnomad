'use client';

import { ActivityCard } from '@/app/(main)/components/activity-card';
import {
  MAIN_ACTIVITIES,
  MAIN_CATEGORIES,
  MAIN_SORT_OPTIONS,
} from '@/app/(main)/main.constants';
import { FilterButton } from '@/shared/components/buttons';
import { Dropdown } from '@/shared/components/dropdown';
import { Heading } from '@/shared/components/heading';

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
  return (
    <section className="mx-auto w-full max-w-280 px-4 md:px-0">
      <div className="mb-5 flex items-center justify-between gap-4">
        <Heading as="h2" textStyle="typo-3xl-bold" color="text-gray-950">
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

      <div className="scrollbar-hide mb-5 flex gap-3 overflow-x-auto">
        {MAIN_CATEGORIES.map((category) => (
          <FilterButton
            key={category.value}
            label={category.label}
            category={category.iconCategory}
            className="shrink-0 whitespace-nowrap"
          />
        ))}
      </div>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {MAIN_ACTIVITIES.map((activity) => (
          <li key={activity.id}>
            <ActivityCard activity={activity} />
          </li>
        ))}
      </ul>
    </section>
  );
}
