'use client';

import { ActivityReviewsProps } from '@/app/(main)/activity/[id]/components/activity-reviews/activityReviews.types';
import { IcStar } from '@/shared/assets/icons';
import { Pagination } from '@/shared/components/pagination';
import { cn } from '@/shared/utils/cn';
import { formatDate } from '@/shared/utils/formatDate';

const MAX_RATING = 5;

const formatCount = (count: number) => count.toLocaleString('ko-KR');

const formatRating = (rating: number) =>
  Number.isFinite(rating) ? rating.toFixed(1) : '0.0';

const renderStars = (rating: number) => {
  const filledStars = Math.max(0, Math.min(MAX_RATING, Math.round(rating)));

  return Array.from({ length: MAX_RATING }, (_, index) => (
    <IcStar
      key={`${rating}-${index}`}
      aria-hidden="true"
      className={cn(
        'size-4 shrink-0',
        index < filledStars ? 'text-yellow-500' : 'text-gray-100'
      )}
    />
  ));
};

export function ActivityReviews({
  averageRating,
  totalCount,
  reviews,
  totalPages,
  currentPage,
  onPageChange,
  className,
}: ActivityReviewsProps) {
  const safeAverageRating = formatRating(averageRating);

  return (
    <section className={cn('w-full', className)}>
      <div className="flex items-center gap-2">
        <h3 className="typo-md-bold md:typo-2lg-bold leading-none tracking-tight text-gray-950">
          체험 후기
        </h3>
        <span className="typo-md-semibold md:typo-lg-bold leading-6 tracking-tight text-gray-600 md:leading-none">
          {formatCount(totalCount)}개
        </span>
      </div>

      <div className="mt-6 flex flex-col items-center md:mt-10">
        <strong className="typo-2xl-semibold md:typo-3xl-bold text-center leading-8 tracking-tight text-gray-950 md:leading-[42px]">
          {safeAverageRating}
        </strong>
        <p className="typo-md-bold md:typo-lg-bold mt-1 text-center leading-6 tracking-tight text-gray-950 md:leading-none">
          매우 만족
        </p>
        <div className="mt-1 flex items-center gap-1">
          <IcStar
            aria-hidden="true"
            className="size-4 shrink-0 text-yellow-500"
          />
          <span className="typo-md-medium tracking-tight text-gray-600">
            {formatCount(totalCount)}개 후기
          </span>
        </div>
      </div>

      {reviews.length > 0 ? (
        <div className="mt-6 flex flex-col gap-10 md:mt-8 md:gap-5">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-3xl bg-white p-5 shadow-[0px_4px_24px_0px_rgba(156,180,202,0.2)]"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="typo-md-semibold md:typo-lg-bold leading-6 tracking-tight text-gray-950 md:leading-none">
                    {review.user.nickname}
                  </p>
                  <time
                    dateTime={review.createdAt}
                    className="typo-xs-semibold md:typo-md-medium leading-[18px] tracking-tight text-gray-400 md:leading-none"
                  >
                    {formatDate(review.createdAt)}
                  </time>
                </div>

                <div className="mt-1.5 flex items-center -space-x-px">
                  {renderStars(review.rating)}
                </div>
              </div>

              <p className="typo-md-medium md:typo-lg-medium mt-2 leading-6 tracking-tight text-gray-950 md:mt-3 md:leading-[180%]">
                {review.content}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="typo-md-medium md:typo-lg-medium bg-gray-25 mt-6 rounded-3xl p-8 text-center leading-6 tracking-tight text-gray-600 md:mt-8 md:leading-[180%]">
          아직 등록된 후기가 없습니다.
        </p>
      )}

      <div className="mt-[30px] md:mt-10">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </section>
  );
}
