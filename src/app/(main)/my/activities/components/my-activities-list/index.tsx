'use client';

import { useInView } from 'react-intersection-observer';
import { useMyActivitiesInfinite } from '@/app/(main)/my/activities/hooks/useMyActivitiesInfinite';
import { ActivityCard } from '@/app/(main)/my/components/activity-card';
import { MyPageEmpty } from '@/app/(main)/my/components/my-page-empty';
import { Button } from '@/shared/components/buttons';
import { Spinner } from '@/shared/components/spinner';

export function MyActivitiesList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMyActivitiesInfinite();

  const { ref } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const activitiesList =
    data?.pages.flatMap((page) => page?.activities ?? []) ?? [];

  return (
    <>
      {activitiesList.length === 0 ? (
        <MyPageEmpty
          message="아직 등록한 체험이 없어요"
          buttonLabel="체험 등록하기"
          href="/activity/add"
        />
      ) : (
        <ul className="flex flex-col gap-7.5 wrap-anywhere">
          {activitiesList.map((activity, index) => {
            const { id, title, bannerImageUrl, rating, reviewCount, price } =
              activity;

            return (
              <ActivityCard key={id}>
                <ActivityCard.Info
                  index={index}
                  title={title}
                  activityId={id}
                  bannerImageUrl={bannerImageUrl}
                >
                  <ActivityCard.Heading title={title} />
                  <ActivityCard.Rating
                    rating={rating}
                    reviewCount={reviewCount}
                  />
                  <ActivityCard.Price price={price} />
                </ActivityCard.Info>
                <ActivityCard.Buttons>
                  <ul className="flex gap-3 *:flex-1">
                    <li>
                      <Button variant="secondary" size="md" className="w-full">
                        수정하기
                      </Button>
                    </li>
                    <li>
                      <Button
                        variant="secondary"
                        size="md"
                        className="bg-gray-25 w-full"
                      >
                        삭제하기
                      </Button>
                    </li>
                  </ul>
                </ActivityCard.Buttons>
              </ActivityCard>
            );
          })}
        </ul>
      )}
      <div ref={ref} className="flex h-20 items-center justify-center">
        {isFetchingNextPage && <Spinner />}
      </div>
    </>
  );
}
