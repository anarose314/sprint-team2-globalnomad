import { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { MY_ACTIVITIES_SIZE } from '@/app/(main)/my/activities/activities.constants';
import { ActivityButton } from '@/app/(main)/my/activities/components/activity-add-button';
import { MyActivitiesList } from '@/app/(main)/my/activities/components/my-activities-list';
import { myActivitiesOptions } from '@/app/(main)/my/activities/hooks/useMyActivitiesInfinite';
import { MyPageHeader } from '@/app/(main)/my/components/my-page-header';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';
import { MyActivitiesResponse } from '@/shared/types/myActivities.types';

export const metadata: Metadata = {
  title: '내 체험 관리',
};

export default async function MyActivitiesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    ...myActivitiesOptions(),
    queryFn: () =>
      fetchInstanceServer<MyActivitiesResponse>(
        `/my-activities?size=${MY_ACTIVITIES_SIZE}`
      ),
  });

  return (
    <section className="pb-16 2xl:pb-40">
      <MyPageHeader
        title="내 체험 관리"
        description="체험을 등록하거나 수정 및 삭제가 가능합니다."
      >
        <ActivityButton />
      </MyPageHeader>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MyActivitiesList />
      </HydrationBoundary>
    </section>
  );
}
