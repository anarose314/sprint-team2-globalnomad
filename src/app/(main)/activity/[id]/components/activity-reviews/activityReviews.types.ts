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

export interface ActivityReviewsResponse {
  averageRating: number;
  totalCount: number;
  reviews: ActivityReview[];
}

export interface ActivityReviewsProps {
  averageRating: number;
  totalCount: number;
  reviews: ActivityReview[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  className?: string;
}

export interface ActivityReviewsSectionProps {
  activityId: number;
  className?: string;
}
