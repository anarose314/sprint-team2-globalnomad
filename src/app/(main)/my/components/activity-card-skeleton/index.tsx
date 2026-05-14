import { ActivityCard } from '@/app/(main)/my/components/activity-card';
import { Skeleton } from '@/shared/components/skeleton';

export function ActivityCardSkeleton() {
  return (
    <ul className="flex flex-col gap-7.5 wrap-anywhere">
      {Array.from({ length: 3 }).map((_, i) => (
        <ActivityCard key={i}>
          <article className="flex flex-col gap-3">
            {/* 카드 영역 */}
            <Skeleton className="min-h-45 w-full rounded-3xl" />
            {/* 하단 버튼 영역 */}
            <Skeleton fullWidth height={48} rounded="lg" />
          </article>
        </ActivityCard>
      ))}
    </ul>
  );
}
