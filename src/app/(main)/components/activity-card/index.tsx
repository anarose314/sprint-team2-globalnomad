import type { ActivityCardProps } from '@/app/(main)/components/activity-card/activityCard.types';
import { IcStar } from '@/shared/assets/icons';
import { Heading } from '@/shared/components/heading';

/**
 * 메인 페이지 체험 카드 컴포넌트
 *
 * - 체험 이미지 영역과 텍스트 영역을 표시한다.
 * - 텍스트 영역은 이미지 하단부와 겹치며, 겹친 영역은 텍스트 영역이 차지한다.
 * - 현재 UI 단계에서는 이미지 원본이 확정되지 않아 이미지 영역을 placeholder로 표시한다.
 *
 * @example
 * <ActivityCard activity={activity} />
 */
export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <article className="shadow-card h-full w-full overflow-hidden rounded-3xl bg-white">
      <div className="relative aspect-square w-full bg-gray-200" />

      <div className="z-base relative -mt-8.5 flex flex-col justify-between bg-white px-4 pt-3 pb-4.25 md:-mt-15 md:px-5 md:pt-5 md:pb-7.5">
        <Heading
          as="h3"
          textStyle="typo-md-semibold"
          className="md:typo-lg-semibold truncate text-gray-950"
        >
          {activity.title}
        </Heading>

        <div className="flex items-center gap-1">
          <IcStar
            className="h-3.5 w-3.5 shrink-0 text-yellow-500 md:h-4 md:w-4"
            aria-hidden="true"
          />
          <span className="typo-xs-medium md:typo-sm-medium text-gray-950">
            {activity.rating}
          </span>
          <span className="typo-xs-medium md:typo-sm-medium text-gray-400">
            ({activity.reviewCount})
          </span>
        </div>

        <p className="typo-lg-bold 2xl:typo-xl-bold mt-1 wrap-anywhere text-gray-950">
          {'₩' + activity.price.toLocaleString()}
          <span className="typo-md-medium 2xl:typo-lg-medium text-gray-400">
            {' /인'}
          </span>
        </p>
      </div>
    </article>
  );
}
