'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchActivityReviews } from '@/app/(main)/activity/[id]/apis/activityReviews';
import { ActivityReviews } from '@/app/(main)/activity/[id]/components/activity-reviews';
import {
  ActivityReviewsResponse,
  ActivityReviewsSectionProps,
} from '@/app/(main)/activity/[id]/components/activity-reviews/activityReviews.types';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';

const REVIEW_PAGE_SIZE = 3;
const PAGE_QUERY_KEY = 'page';
const INITIAL_REVIEWS_RESPONSE: ActivityReviewsResponse = {
  averageRating: 0,
  totalCount: 0,
  reviews: [],
};

const parsePageQuery = (value: string | null) => {
  if (!value) {
    return 1;
  }

  const parsedValue = Number(value);
  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return 1;
  }

  return parsedValue;
};

export function ActivityReviewsSection({
  activityId,
  className,
}: ActivityReviewsSectionProps) {
  return (
    <ActivityReviewsSectionInner
      key={activityId}
      activityId={activityId}
      className={className}
    />
  );
}

function ActivityReviewsSectionInner({
  activityId,
  className,
}: ActivityReviewsSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = useMemo(
    () => parsePageQuery(searchParams.get(PAGE_QUERY_KEY)),
    [searchParams]
  );

  const {
    data: reviewData = INITIAL_REVIEWS_RESPONSE,
    isLoading,
    error,
  } = useQuery<ActivityReviewsResponse>({
    queryKey: [
      ...QUERY_KEYS.ACTIVITY_REVIEWS,
      activityId,
      currentPage,
      REVIEW_PAGE_SIZE,
    ],
    queryFn: () =>
      fetchActivityReviews({
        activityId,
        page: currentPage,
        size: REVIEW_PAGE_SIZE,
      }),
    placeholderData: (previousData) => previousData,
  });

  const totalPages = useMemo(() => {
    return Math.ceil(reviewData.totalCount / REVIEW_PAGE_SIZE);
  }, [reviewData.totalCount]);
  const normalizedCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : currentPage;

  useEffect(() => {
    if (currentPage === normalizedCurrentPage) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (normalizedCurrentPage > 1) {
      params.set(PAGE_QUERY_KEY, String(normalizedCurrentPage));
    } else {
      params.delete(PAGE_QUERY_KEY);
    }

    router.replace(
      params.toString() ? `${pathname}?${params.toString()}` : pathname,
      { scroll: false }
    );
  }, [currentPage, normalizedCurrentPage, pathname, router, searchParams]);

  const handlePageChange = (page: number) => {
    if (isLoading || page === normalizedCurrentPage) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set(PAGE_QUERY_KEY, String(page));
    } else {
      params.delete(PAGE_QUERY_KEY);
    }

    router.replace(
      params.toString() ? `${pathname}?${params.toString()}` : pathname,
      { scroll: false }
    );
  };

  return (
    <ActivityReviews
      averageRating={reviewData.averageRating}
      totalCount={reviewData.totalCount}
      reviews={reviewData.reviews}
      totalPages={totalPages}
      currentPage={normalizedCurrentPage}
      onPageChange={handlePageChange}
      isLoading={isLoading}
      errorMessage={error ? '후기를 불러오는 중 오류가 발생했습니다.' : null}
      className={className}
    />
  );
}
