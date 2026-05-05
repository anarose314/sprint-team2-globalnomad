import { MAIN_CATEGORIES } from '@/app/(main)/main.constants';
import { FilterButton } from '@/shared/components/buttons';
import { Heading } from '@/shared/components/heading';

/**
 * 메인 페이지 모든 체험 섹션 컴포넌트
 *
 * - 모든 체험 영역의 제목과 카테고리 필터 UI를 표시한다.
 * - 현재 UI 단계에서는 선택 상태와 필터링 로직을 포함하지 않는다.
 *
 * @example
 * <AllActivitySection />
 */
export function AllActivitySection() {
  return (
    <section className="mx-auto w-full max-w-280 px-4 md:px-0">
      <Heading as="h2" textStyle="typo-3xl-bold" className="mb-5 text-gray-950">
        모든 체험
      </Heading>

      <div className="scrollbar-hide flex gap-3 overflow-x-auto">
        {MAIN_CATEGORIES.map((category) => (
          <FilterButton
            key={category.value}
            label={category.label}
            category={category.iconCategory}
            className="shrink-0 whitespace-nowrap"
          />
        ))}
      </div>
    </section>
  );
}
