'use client';

import { usePopularActivitiesInfinite } from '@/app/(main)/activity/hooks/usePopularActivitiesInfinite';
import { ActivityCard } from '@/app/(main)/components/activity-card';
import { Heading } from '@/shared/components/heading';
import { cn } from '@/shared/utils/cn';

/**
 * 메인 페이지 인기 체험 섹션 컴포넌트
 *
 * - 댓글 수가 많은 순으로 인기 체험 목록을 조회한다.
 * - PR3 커밋 2에서는 실제 API 데이터를 렌더링한다.
 * - 가로 무한 스크롤 감지는 다음 커밋에서 연결한다.
 *
 * @example
 * <PopularActivitySection />
 */
export function PopularActivitySection() {
  const { data, isPending, isError } = usePopularActivitiesInfinite();

  const activities = data?.pages.flatMap((page) => page.activities) ?? [];

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
        <p className="typo-md-medium py-10 text-center text-gray-500">
          인기 체험을 불러오는 중입니다.
        </p>
      )}

      {isError && (
        <p className="typo-md-medium py-10 text-center text-red-500">
          인기 체험을 불러오지 못했습니다.
        </p>
      )}

      {!isPending && !isError && activities.length === 0 && (
        <p className="typo-md-medium py-10 text-center text-gray-500">
          인기 체험이 없습니다.
        </p>
      )}

      {!isPending && !isError && activities.length > 0 && (
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
      )}
    </section>
  );
}
