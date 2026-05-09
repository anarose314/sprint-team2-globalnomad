import { ActivityCard } from '@/app/(main)/components/activity-card';
import type { MainActivity } from '@/app/(main)/main.types';
import { Heading } from '@/shared/components/heading';
import { cn } from '@/shared/utils/cn';

interface PopularActivitySectionProps {
  activities: MainActivity[];
}

/**
 * 메인 페이지 인기 체험 섹션 컴포넌트
 *
 * - 인기 체험 카드를 가로 목록으로 표시한다.
 * - 태블릿/PC 화면에서는 오른쪽 화살표 UI를 함께 표시한다.
 * - 현재 UI 단계에서는 캐러셀 이동 기능을 포함하지 않는다.
 *
 * @example
 * <PopularActivitySection activities={POPULAR_ACTIVITIES} />
 */
export function PopularActivitySection({
  activities,
}: PopularActivitySectionProps) {
  return (
    <section>
      <Heading
        as="h2"
        textStyle="typo-2lg-bold"
        className="2xl:typo-3xl-bold md:typo-2xl-bold mb-6 text-gray-950"
      >
        인기 체험
      </Heading>

      <div className="relative">
        <ul
          className={cn(
            'scrollbar-hide grid grid-flow-col overflow-x-auto pb-4',
            // 초소형 모바일
            '-mx-6 auto-cols-[calc((100%-1rem)/1.15)] gap-4 px-6',
            // 일반 모바일
            'xs:auto-cols-[calc((100%-1rem)/2.1)]',
            // 태블릿
            'md:mx-0 md:auto-cols-[calc((100%-3rem)/3)] md:gap-6 md:px-0',
            // 데스크탑
            '2xl:auto-cols-auto 2xl:grid-flow-row 2xl:grid-cols-4 2xl:overflow-visible'
          )}
        >
          {activities.map((activity) => (
            <li key={activity.id} className="w-full">
              <ActivityCard activity={activity} />
            </li>
          ))}
        </ul>

        <div
          aria-hidden="true"
          className="shadow-card pointer-events-none absolute top-1/2 right-0 hidden h-13.5 w-13.5 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white md:flex"
        >
          <span className="h-3 w-3 rotate-45 border-t-2 border-r-2 border-gray-950" />
        </div>
      </div>
    </section>
  );
}
