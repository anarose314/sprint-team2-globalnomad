import { ActivityReviewsResponse } from '@/app/(main)/activity/[id]/components/activity-reviews/activityReviews.types';
import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';

interface FetchActivityReviewsProps {
  activityId: number;
  page: number;
  size: number;
}

/**
 * 체험 후기 목록 조회
 */
export const fetchActivityReviews = async ({
  activityId,
  page,
  size,
}: FetchActivityReviewsProps): Promise<ActivityReviewsResponse> => {
  const response = await fetchInstanceClient<ActivityReviewsResponse>(
    `/api/proxy/activities/${activityId}/reviews`,
    {
      params: {
        page,
        size,
      },
    }
  );

  return {
    averageRating: response.averageRating ?? 0,
    totalCount: response.totalCount ?? 0,
    reviews: response.reviews ?? [],
  };
};
