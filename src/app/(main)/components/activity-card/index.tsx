import type { ActivityCardProps } from '@/app/(main)/components/activity-card/activityCard.types';
import { IcStar } from '@/shared/assets/icons';

/**
 * 메인 페이지 체험 카드 컴포넌트
 *
 * - 체험 이미지 영역, 제목, 평점, 리뷰 수, 가격 정보를 표시한다.
 * - 현재 UI 단계에서는 이미지 원본이 확정되지 않아 이미지 영역을 placeholder로 표시한다.
 *
 * @example
 * <ActivityCard activity={activity} />
 */
export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <article className="shadow-card w-full overflow-hidden rounded-3xl bg-white">
      <div className="h-40 w-full bg-gray-200 md:h-45" />

      <div className="flex flex-col gap-2 px-4 py-4">
        <h3 className="typo-lg-semibold truncate text-gray-950">
          {activity.title}
        </h3>

        <div className="flex items-center gap-1">
          <IcStar className="h-4 w-4 shrink-0 text-yellow-500" />
          <span className="typo-md-medium text-gray-950">
            {activity.rating}
          </span>
          <span className="typo-md-medium text-gray-400">
            ({activity.reviewCount})
          </span>
        </div>

        <p className="typo-xl-bold text-gray-950">
          ₩ {activity.price.toLocaleString()}
          <span className="typo-lg-medium text-gray-400"> / 인</span>
        </p>
      </div>
    </article>
  );
}
