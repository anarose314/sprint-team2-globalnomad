import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import type { ActivitiesResponse } from '@/app/(main)/activity/apis/activities.types';
import { activitiesOptions } from '@/app/(main)/activity/hooks/useActivities';
import { AllActivitySection } from '@/app/(main)/components/all-activity-section';
import { MainBanner } from '@/app/(main)/components/main-banner';
import { MainSearch } from '@/app/(main)/components/main-search';
import { PopularActivitySection } from '@/app/(main)/components/popular-activity-section';
import {
  MAIN_PAGE_SIZE,
  POPULAR_ACTIVITIES,
} from '@/app/(main)/main.constants';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';

/**
 * 메인 페이지
 *
 * - 배너, 검색, 인기 체험, 모든 체험 섹션을 렌더링한다.
 * - PR1에서는 모든 체험 목록의 첫 페이지를 서버에서 미리 조회한다.
 * - 검색, 카테고리, 정렬, 인기 체험 API 연동은 이후 작업에서 연결한다.
 */
export default async function HomePage() {
  const queryClient = new QueryClient();

  const activitiesParams = {
    method: 'offset' as const,
    page: 1,
    size: MAIN_PAGE_SIZE,
    sort: 'latest' as const,
  };

  await queryClient.prefetchQuery({
    ...activitiesOptions(activitiesParams),
    queryFn: () =>
      fetchInstanceServer<ActivitiesResponse>('/activities', {
        params: activitiesParams,
      }),
  });

  return (
    <div className="flex flex-col gap-10 py-6 md:gap-15 md:py-10 2xl:gap-20 2xl:py-15">
      <MainBanner />
      <MainSearch />

      <PopularActivitySection activities={POPULAR_ACTIVITIES} />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <AllActivitySection />
      </HydrationBoundary>
    </div>
  );
}
