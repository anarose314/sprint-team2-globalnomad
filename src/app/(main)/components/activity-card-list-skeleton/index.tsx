import type { ActivityCardListSkeletonProps } from '@/app/(main)/components/activity-card-list-skeleton/activityCardListSkeleton.types';
import { ActivityCardSkeleton } from '@/app/(main)/components/activity-card-skeleton';

/**
 * 메인 페이지 체험 카드 목록 스켈레톤 UI
 *
 * - 스켈레톤 UI는 보조공학기기에 노출되지 않도록 숨긴다.
 * - 스크린 리더 사용자에게는 로딩 상태 메시지를 별도로 제공한다.
 *
 * @example
 * <ActivityCardListSkeleton
 *   count={6}
 *   className="grid grid-cols-2"
 *   message="모든 체험 목록을 불러오는 중입니다."
 * />
 */
export function ActivityCardListSkeleton({
  count,
  className,
  message = '체험 목록을 불러오는 중입니다.',
}: ActivityCardListSkeletonProps) {
  return (
    <>
      <span className="sr-only" role="status">
        {message}
      </span>

      <ul className={className} aria-hidden="true">
        {Array.from({ length: count }).map((_, index) => (
          <li key={index}>
            <ActivityCardSkeleton />
          </li>
        ))}
      </ul>
    </>
  );
}
