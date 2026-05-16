import { Skeleton } from '@/shared/components/skeleton';
import { ACTIVITY_IMAGE_GALLERY_FRAME_CLASS } from '@/shared/constants/activityImageGallery.constants';
import { cn } from '@/shared/utils/cn';

function ActivityInfoHeaderSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col', className)} aria-hidden="true">
      <Skeleton height={16} className="w-20 md:w-24" variant="shimmer" />
      <Skeleton className="mt-1 h-7 w-full md:h-8 md:w-4/5" variant="shimmer" />
      <div className="mt-1 flex items-center gap-2">
        <Skeleton height={16} width={16} rounded="sm" variant="shimmer" />
        <Skeleton height={16} className="w-28" variant="shimmer" />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Skeleton height={16} width={16} rounded="sm" variant="shimmer" />
        <Skeleton height={16} className="w-48 md:w-64" variant="shimmer" />
      </div>
    </div>
  );
}

export type ActivityDetailGalleryImageCount = 1 | 2 | 3 | 4;

function ActivityImageGallerySkeleton({
  className,
  imageCount = 3,
}: {
  className?: string;
  /** 실제 갤러리와 동일한 격자. 초기 로딩에서는 개수를 모르면 기본 3. */
  imageCount?: ActivityDetailGalleryImageCount;
}) {
  const frame = cn(ACTIVITY_IMAGE_GALLERY_FRAME_CLASS, className);

  if (imageCount === 1) {
    return (
      <div className={cn(frame, 'flex min-h-0 flex-col')} aria-hidden="true">
        <Skeleton
          className="min-h-0 flex-1"
          fullWidth
          rounded="none"
          variant="shimmer"
        />
      </div>
    );
  }

  if (imageCount === 2) {
    return (
      <div
        className={cn(frame, 'flex min-h-0 flex-col gap-2')}
        aria-hidden="true"
      >
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
    );
  }

  if (imageCount === 3) {
    return (
      <div
        className={cn(frame, 'grid grid-cols-2 grid-rows-2 gap-2')}
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

  return (
    <div
      className={cn(frame, 'grid min-h-0 grid-cols-2 grid-rows-2 gap-2')}
      aria-hidden="true"
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-full min-h-0"
          fullWidth
          rounded="none"
          variant="shimmer"
        />
      ))}
    </div>
  );
}

function DesktopReservationCardSkeleton() {
  return (
    <aside className="hidden w-full 2xl:block" aria-hidden="true">
      <div className="shadow-review-card w-full max-w-103 overflow-hidden rounded-3xl border border-gray-100 bg-white">
        <div className="p-8">
          <div className="mx-auto w-88">
            <Skeleton height={32} className="w-40" variant="shimmer" />
            <Skeleton
              height={220}
              fullWidth
              className="mt-6"
              rounded="xl"
              variant="shimmer"
            />
            <div className="mt-6 flex items-center justify-between">
              <Skeleton height={20} className="w-24" variant="shimmer" />
              <Skeleton
                height={40}
                className="w-35"
                rounded="full"
                variant="shimmer"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Skeleton
                height={40}
                className="w-22"
                rounded="lg"
                variant="shimmer"
              />
              <Skeleton
                height={40}
                className="w-22"
                rounded="lg"
                variant="shimmer"
              />
              <Skeleton
                height={40}
                className="w-22"
                rounded="lg"
                variant="shimmer"
              />
            </div>
            <Skeleton
              height={48}
              fullWidth
              className="mt-6"
              rounded="xl"
              variant="shimmer"
            />
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
        <Skeleton className="h-5 w-24 md:h-7 md:w-28" variant="shimmer" />
        <Skeleton className="h-5 w-10 md:h-6 md:w-12" variant="shimmer" />
      </div>

      <div className="mt-6 flex flex-col items-center md:mt-10">
        <Skeleton className="h-9 w-14 md:h-10.5 md:w-16" variant="shimmer" />
        <Skeleton className="mt-1 h-5 w-28 md:h-6 md:w-32" variant="shimmer" />
        <div className="mt-1 flex items-center gap-1">
          <Skeleton height={16} width={16} rounded="sm" variant="shimmer" />
          <Skeleton className="h-5 w-28 md:h-6 md:w-32" variant="shimmer" />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-10 md:mt-8 md:gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="shadow-review-card rounded-3xl bg-white p-5">
            <div>
              <div className="flex items-center gap-2">
                <Skeleton
                  className="h-5 w-28 md:h-6 md:w-32"
                  variant="shimmer"
                />
                <Skeleton
                  className="h-4 w-20 md:h-5 md:w-24"
                  variant="shimmer"
                />
              </div>
              <div className="mt-1.5 flex items-center gap-1">
                {Array.from({ length: 5 }).map((__, j) => (
                  <Skeleton
                    key={j}
                    height={16}
                    width={16}
                    rounded="sm"
                    className="shrink-0"
                    variant="shimmer"
                  />
                ))}
              </div>
            </div>
            <Skeleton
              fullWidth
              className="mt-2 h-4 md:mt-3 md:h-5"
              variant="shimmer"
            />
            <Skeleton fullWidth className="mt-2 h-4 md:h-5" variant="shimmer" />
            <Skeleton className="mt-2 h-4 w-3/5 md:h-5" variant="shimmer" />
          </div>
        ))}
      </div>

      <div className="mt-7.5 flex justify-center md:mt-10">
        <Skeleton
          height={40}
          className="w-48 rounded-xl md:w-56"
          variant="shimmer"
        />
      </div>
    </section>
  );
}

export interface ActivityDetailSkeletonProps {
  /** 갤러리 이미지 개수(1~4)에 맞는 스켈레톤 격자. 초기 로딩에서는 알 수 없어 기본 3. */
  galleryImageCount?: ActivityDetailGalleryImageCount;
}

/**
 * 체험 상세 페이지 로딩용 스켈레톤
 *
 * `ActivityDetailPageClient` 레이아웃(이미지 갤러리·헤더·본문·리뷰·예약 카드)에 맞춘 플레이스홀더
 */
export function ActivityDetailSkeleton({
  galleryImageCount = 3,
}: ActivityDetailSkeletonProps = {}) {
  return (
    <div className="skeleton-shimmer-scope-slow py-6 pb-40 md:py-8 md:pb-40 2xl:py-10 2xl:pb-10">
      <div className="mx-auto w-full">
        <div className="flex flex-col gap-4 2xl:grid 2xl:grid-cols-5 2xl:items-start 2xl:gap-10">
          <div className="2xl:col-span-3">
            <ActivityImageGallerySkeleton
              className="mb-5 md:mb-6 2xl:mb-10"
              imageCount={galleryImageCount}
            />

            <div className="mb-5 border-b border-gray-100 pb-5 md:mb-8 md:pb-8 2xl:hidden">
              <ActivityInfoHeaderSkeleton />
            </div>

            <section className="w-full" aria-hidden="true">
              <div className="mb-5 border-b border-gray-100 pb-5 md:mb-8 md:pb-8 2xl:mb-10 2xl:pb-10">
                <Skeleton height={22} className="w-28" variant="shimmer" />
                <Skeleton
                  height={16}
                  fullWidth
                  className="mt-4"
                  variant="shimmer"
                />
                <Skeleton
                  height={16}
                  fullWidth
                  className="mt-2"
                  variant="shimmer"
                />
                <Skeleton
                  height={16}
                  className="mt-2 w-5/6"
                  variant="shimmer"
                />
                <Skeleton
                  height={16}
                  className="mt-2 w-3/4"
                  variant="shimmer"
                />
              </div>

              <div className="mb-5 border-b border-gray-100 pb-5 md:mb-8 md:pb-8 2xl:mb-10 2xl:pb-10">
                <Skeleton height={22} className="w-28" variant="shimmer" />
                <div className="mt-2 flex items-center gap-2">
                  <Skeleton
                    height={16}
                    width={16}
                    rounded="sm"
                    variant="shimmer"
                  />
                  <Skeleton
                    height={16}
                    className="w-56 md:w-72"
                    variant="shimmer"
                  />
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
