'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchActivityReviews } from '@/app/(main)/activity/[id]/apis/activityReviews';
import { ActivityReviews } from '@/app/(main)/activity/[id]/components/activity-reviews';
import {
  ActivityReviewsResponse,
  ActivityReviewsSectionProps,
} from '@/app/(main)/activity/[id]/components/activity-reviews/activityReviews.types';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';

const REVIEW_PAGE_SIZE = 3;
const INITIAL_REVIEWS_RESPONSE: ActivityReviewsResponse = {
  averageRating: 0,
  totalCount: 0,
  reviews: [],
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
  const [currentPage, setCurrentPage] = useState(1);

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

  const handlePageChange = (page: number) => {
    if (isLoading || page === normalizedCurrentPage) {
      return;
    }
    setCurrentPage(page);
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
