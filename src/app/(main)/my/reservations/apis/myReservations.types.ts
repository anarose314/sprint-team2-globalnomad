export interface FetchMyReservations {
  pageParam?: number | null;
  status?: string | null;
}

export interface PostReviews {
  reservationId: number;
  body: {
    rating: number;
    content: string;
  };
}

export interface ReviewResponse {
  updatedAt: string;
  createdAt: string;
  content: string;
  rating: number;
  userId: number;
  activityId: number;
  teamId: string;
  id: number;
}

export interface PatchMyReservation {
  reservationId: number;
}
