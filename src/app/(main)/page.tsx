import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import type { ActivitiesResponse } from '@/app/(main)/activity/apis/activities.types';
import { activitiesOptions } from '@/app/(main)/activity/hooks/useActivities';
import { MainContent } from '@/app/(main)/components/main-content';
import { MAIN_PAGE_SIZE } from '@/app/(main)/main.constants';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';

/**
 * 메인 페이지
 *
 * - 메인 페이지 콘텐츠를 렌더링한다.
 * - 모든 체험 목록의 첫 페이지를 서버에서 미리 조회한다.
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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MainContent />
    </HydrationBoundary>
  );
}
