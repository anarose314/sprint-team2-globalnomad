import { Skeleton } from '@/shared/components/skeleton';

/**
 * 메인 페이지 체험 카드 스켈레톤 UI
 *
 * @example
 * <ActivityCardSkeleton />
 */
export function ActivityCardSkeleton() {
  return (
    <article className="shadow-card h-full w-full overflow-hidden rounded-3xl bg-white">
      <Skeleton className="aspect-square w-full" rounded="xl" />

      <div className="relative -mt-8.5 flex flex-col gap-2 bg-white px-4 pt-3 pb-4.25 md:-mt-15 md:px-5 md:pt-5 md:pb-7.5">
        <Skeleton height={20} className="w-3/4" rounded="sm" />
        <Skeleton height={16} className="w-1/2" rounded="sm" />
        <Skeleton height={24} className="w-2/3" rounded="sm" />
      </div>
    </article>
  );
}
