import Link from 'next/link';
import { ActivityCardProps } from '@/app/(main)/my/components/activity-card/activityCard.types';

/**
 * [예약 내역] 및 [내 체험 관리] 에서 사용하는 카드 형태의 링크 컴포넌트.
 * @example
 * <ActivityCard href={`/activity/${activityId}`}>
 *   <div className="flex-1 px-4 py-4">카드 텍스트 내용</div>
 *   <figure className="relative w-1/3">이미지 영역</figure>
 * </ActivityCard>
 */
export function ActivityCard({ href, children }: ActivityCardProps) {
  return (
    <Link
      href={href}
      className="shadow-card group flex min-h-45 justify-between overflow-hidden rounded-3xl"
    >
      {children}
    </Link>
  );
}
