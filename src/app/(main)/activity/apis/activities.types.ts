export interface Activity {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  address: string;
  bannerImageUrl?: string | null;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActivitiesResponse {
  cursorId: number;
  totalCount: number;
  activities: Activity[];
}

export interface FetchActivitiesParams {
  method: 'offset';
  page: number;
  size: number;
  sort?: 'latest';
}

export interface ActivityImageResponse {
  activityImageUrl: string;
}
