'use client';

import { useEffect, useMemo, useState } from 'react';
import { ActivityReviews } from '@/app/(main)/activity/[id]/components/activity-reviews';
import {
  ActivityReviewsResponse,
  ActivityReviewsSectionProps,
} from '@/app/(main)/activity/[id]/components/activity-reviews/activityReviews.types';
import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewData, setReviewData] = useState<ActivityReviewsResponse>(
    INITIAL_REVIEWS_RESPONSE
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalPages = useMemo(() => {
    return Math.ceil(reviewData.totalCount / REVIEW_PAGE_SIZE);
  }, [reviewData.totalCount]);

  useEffect(() => {
    setCurrentPage(1);
    setReviewData(INITIAL_REVIEWS_RESPONSE);
  }, [activityId]);

  useEffect(() => {
    let isCancelled = false;

    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response = await fetchInstanceClient<ActivityReviewsResponse>(
          `/api/proxy/activities/${activityId}/reviews`,
          {
            params: {
              page: currentPage,
              size: REVIEW_PAGE_SIZE,
            },
          }
        );

        if (isCancelled) {
          return;
        }

        setReviewData({
          averageRating: response.averageRating ?? 0,
          totalCount: response.totalCount ?? 0,
          reviews: response.reviews ?? [],
        });
      } catch {
        if (isCancelled) {
          return;
        }
        setErrorMessage('후기를 불러오는 중 오류가 발생했습니다.');
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      isCancelled = true;
    };
  }, [activityId, currentPage]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    if (isLoading || page === currentPage) {
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
      currentPage={currentPage}
      onPageChange={handlePageChange}
      isLoading={isLoading}
      errorMessage={errorMessage}
      className={className}
    />
  );
}
