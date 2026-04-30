'use client';

import { useState } from 'react';
import { ActivityReviews } from '@/app/(main)/activity/[id]/components/activity-reviews';
import { ActivityReviewsSectionProps } from '@/app/(main)/activity/[id]/components/activity-reviews/activityReviews.types';

export function ActivityReviewsSection({
  averageRating,
  totalCount,
  reviews,
  totalPages,
  className,
}: ActivityReviewsSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <ActivityReviews
      averageRating={averageRating}
      totalCount={totalCount}
      reviews={reviews}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      className={className}
    />
  );
}
