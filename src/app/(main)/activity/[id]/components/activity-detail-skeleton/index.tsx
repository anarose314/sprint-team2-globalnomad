import { Skeleton } from '@/shared/components/skeleton';
import { cn } from '@/shared/utils/cn';

function ActivityInfoHeaderSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col', className)} aria-hidden="true">
      <Skeleton height={16} className="w-20 md:w-24" />
      <Skeleton className="mt-1 h-7 w-full md:h-8 md:w-4/5" />
      <div className="mt-1 flex items-center gap-2">
        <Skeleton height={16} width={16} rounded="sm" />
        <Skeleton height={16} className="w-28" />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Skeleton height={16} width={16} rounded="sm" />
        <Skeleton height={16} className="w-48 md:w-64" />
      </div>
    </div>
  );
}

function ActivityImageGallerySkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'grid aspect-327/188 grid-cols-2 grid-rows-2 gap-2 overflow-hidden rounded-3xl md:aspect-684/360 2xl:aspect-auto 2xl:h-128',
        className
      )}
      aria-hidden="true"
    >
      <Skeleton
        className="row-span-2 h-full min-h-0"
        fullWidth
        rounded="none"
        variant="shimmer"
      />
      <div className="row-span-2 flex h-full min-h-0 flex-col gap-2">
        <Skeleton
          className="min-h-0 flex-1"
          fullWidth
          rounded="none"
          variant="shimmer"
        />
        <Skeleton
          className="min-h-0 flex-1"
          fullWidth
          rounded="none"
          variant="shimmer"
        />
      </div>
    </div>
  );
}

function DesktopReservationCardSkeleton() {
  return (
    <aside className="hidden w-full 2xl:block" aria-hidden="true">
      <div className="shadow-review-card w-full max-w-103 overflow-hidden rounded-3xl border border-gray-100 bg-white">
        <div className="p-8">
          <div className="mx-auto w-88">
            <Skeleton height={32} className="w-40" />
            <Skeleton
              height={220}
              fullWidth
              className="mt-6"
              rounded="xl"
              variant="shimmer"
            />
            <div className="mt-6 flex items-center justify-between">
              <Skeleton height={20} className="w-24" />
              <Skeleton height={40} className="w-35" rounded="full" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Skeleton height={40} className="w-22" rounded="lg" />
              <Skeleton height={40} className="w-22" rounded="lg" />
              <Skeleton height={40} className="w-22" rounded="lg" />
            </div>
            <Skeleton height={48} fullWidth className="mt-6" rounded="xl" />
          </div>
        </div>
      </div>
    </aside>
  );
}

function ActivityReviewsSectionSkeleton() {
  return (
    <section className="mt-8 w-full md:mt-10" aria-hidden="true">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-24 md:h-7 md:w-28" />
        <Skeleton className="h-5 w-10 md:h-6 md:w-12" />
      </div>

      <div className="mt-6 flex flex-col items-center md:mt-10">
        <Skeleton className="h-9 w-14 md:h-10.5 md:w-16" />
        <Skeleton className="mt-1 h-5 w-28 md:h-6 md:w-32" />
        <div className="mt-1 flex items-center gap-1">
          <Skeleton height={16} width={16} rounded="sm" />
          <Skeleton className="h-5 w-28 md:h-6 md:w-32" />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-10 md:mt-8 md:gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="shadow-review-card rounded-3xl bg-white p-5">
            <div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-28 md:h-6 md:w-32" />
                <Skeleton className="h-4 w-20 md:h-5 md:w-24" />
              </div>
              <div className="mt-1.5 flex items-center gap-1">
                {Array.from({ length: 5 }).map((__, j) => (
                  <Skeleton
                    key={j}
                    height={16}
                    width={16}
                    rounded="sm"
                    className="shrink-0"
                  />
                ))}
              </div>
            </div>
            <Skeleton fullWidth className="mt-2 h-4 md:mt-3 md:h-5" />
            <Skeleton fullWidth className="mt-2 h-4 md:h-5" />
            <Skeleton className="mt-2 h-4 w-3/5 md:h-5" />
          </div>
        ))}
      </div>

      <div className="mt-7.5 flex justify-center md:mt-10">
        <Skeleton height={40} className="w-48 rounded-xl md:w-56" />
      </div>
    </section>
  );
}

/**
 * 체험 상세 페이지 로딩용 스켈레톤
 *
 * `ActivityDetailPageClient` 레이아웃(이미지 갤러리·헤더·본문·리뷰·예약 카드)에 맞춘 플레이스홀더
 */
export function ActivityDetailSkeleton() {
  return (
    <div className="py-6 pb-40 md:py-8 md:pb-40 2xl:py-10 2xl:pb-10">
      <div className="mx-auto w-full">
        <div className="flex flex-col gap-4 2xl:grid 2xl:grid-cols-5 2xl:items-start 2xl:gap-10">
          <div className="2xl:col-span-3">
            <ActivityImageGallerySkeleton className="mb-5 md:mb-6 2xl:mb-10" />

            <div className="mb-5 border-b border-gray-100 pb-5 md:mb-8 md:pb-8 2xl:hidden">
              <ActivityInfoHeaderSkeleton />
            </div>

            <section className="w-full" aria-hidden="true">
              <div className="mb-5 border-b border-gray-100 pb-5 md:mb-8 md:pb-8 2xl:mb-10 2xl:pb-10">
                <Skeleton height={22} className="w-28" />
                <Skeleton height={16} fullWidth className="mt-4" />
                <Skeleton height={16} fullWidth className="mt-2" />
                <Skeleton height={16} className="mt-2 w-5/6" />
                <Skeleton height={16} className="mt-2 w-3/4" />
              </div>

              <div className="mb-5 border-b border-gray-100 pb-5 md:mb-8 md:pb-8 2xl:mb-10 2xl:pb-10">
                <Skeleton height={22} className="w-28" />
                <div className="mt-2 flex items-center gap-2">
                  <Skeleton height={16} width={16} rounded="sm" />
                  <Skeleton height={16} className="w-56 md:w-72" />
                </div>
                <Skeleton
                  fullWidth
                  className="mt-4 h-60 md:h-80 2xl:h-96"
                  rounded="xl"
                  variant="shimmer"
                />
              </div>
            </section>

            <ActivityReviewsSectionSkeleton />
          </div>

          <div className="2xl:col-span-2 2xl:self-stretch">
            <div className="mb-8 hidden w-full max-w-103 2xl:block">
              <ActivityInfoHeaderSkeleton />
            </div>
            <div className="2xl:sticky 2xl:top-24">
              <DesktopReservationCardSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
