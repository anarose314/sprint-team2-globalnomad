'use client';

import Image from 'next/image';
import { useMyActivitiesInfinite } from '@/app/(main)/my/activities/apis/myActivities';
import { MyActivitiesClientListProps } from '@/app/(main)/my/activities/components/my-activities-client-list/myActivitiesClientList.types';
import { ActivityCard } from '@/app/(main)/my/components/activity-card';
import { IcStar } from '@/shared/assets/icons';
import { Button } from '@/shared/components/buttons';
import { Heading } from '@/shared/components/heading';

export function MyActivitiesClientList({
  initialData,
}: MyActivitiesClientListProps) {
  const { data } = useMyActivitiesInfinite(initialData);
  const activitiesList = data.pages.flatMap((page) => page.activities);

  return (
    <>
      {activitiesList.map((activity, index) => (
        <li key={activity.id}>
          <article className="flex flex-col gap-3 border-b border-b-gray-50 pb-7.5">
            {/* 카드 */}
            <ActivityCard href={`/activity/${activity.id}`}>
              <div className="flex flex-1 flex-col justify-center gap-1 px-4 py-4">
                <Heading as="h3" className="typo-md-bold 2xl:typo-2lg-bold">
                  {activity.title}
                </Heading>
                <div className="flex items-center gap-0.5">
                  <IcStar className="w-3.5 text-yellow-500" />
                  <p className="typo-sm-medium 2xl:typo-lg-medium text-gray-500">
                    {activity.rating} ({activity.reviewCount})
                  </p>
                </div>
                <p className="typo-lg-bold 2xl:typo-2lg-bold mt-1 flex items-center gap-1 text-gray-950">
                  ₩{activity.price.toLocaleString('ko-KR')}
                  <span className="typo-md-medium 2xl:typo-lg-medium text-gray-400">
                    / 인
                  </span>
                </p>
              </div>
              <figure className="relative w-1/3 shrink-0 overflow-hidden md:w-1/4">
                <Image
                  fill
                  src={activity.bannerImageUrl}
                  alt={activity.title}
                  priority={index === 0}
                  sizes="(min-width: 768px) 25vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </figure>
            </ActivityCard>
            {/* 버튼 */}
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
          </article>
        </li>
      ))}
    </>
  );
}
