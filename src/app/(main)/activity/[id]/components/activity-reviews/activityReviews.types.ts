export interface ActivityReviewUser {
  id: number;
  nickname: string;
  profileImageUrl: string;
}

export interface ActivityReview {
  id: number;
  user: ActivityReviewUser;
  activityId: number;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityReviewsProps {
  averageRating: number;
  totalCount: number;
  reviews: ActivityReview[];
  totalPages: number;
  className?: string;
}
