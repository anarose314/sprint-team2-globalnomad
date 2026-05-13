export type ActivityCategory =
  | '문화 · 예술'
  | '식음료'
  | '스포츠'
  | '투어'
  | '관광'
  | '웰빙';

export type ActivitySort =
  | 'latest'
  | 'price_asc'
  | 'price_desc'
  | 'most_reviewed';

export interface Activity {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: ActivityCategory;
  price: number;
  address: string;
  bannerImageUrl?: string | null;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActivitiesResponse {
  cursorId: number | null;
  totalCount: number;
  activities: Activity[];
}

export interface FetchActivitiesParams {
  method: 'offset';
  page: number;
  size: number;
  sort?: ActivitySort;
  category?: ActivityCategory;
  keyword?: string;
}

export interface ActivityImageResponse {
  activityImageUrl: string;
}

export interface FetchPopularActivitiesParams {
  pageParam?: number | null;
}
