import type { ActivityCardListSkeletonProps } from '@/app/(main)/components/activity-card-list-skeleton/activityCardListSkeleton.types';
import { ActivityCardSkeleton } from '@/app/(main)/components/activity-card-skeleton';

/**
 * 메인 페이지 체험 카드 목록 스켈레톤 UI
 *
 * @example
 * <ActivityCardListSkeleton count={6} className="grid grid-cols-2" />
 */
export function ActivityCardListSkeleton({
  count,
  className,
}: ActivityCardListSkeletonProps) {
  return (
    <ul className={className} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <li key={index}>
          <ActivityCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
