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
  cursorId: number;
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

export type CreateSchedule = {
  date: string;
  startTime: string;
  endTime: string;
};

export type PostActivities = {
  title: string;
  category: string;
  description: string;
  price: number;
  address: string;
  schedules: CreateSchedule[];
  bannerImageUrl: string;
  subImageUrls?: string[];
};

export interface PostActivitiesResponse {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  subImages: [
    {
      imageUrl: string;
      id: number;
    },
  ];
  schedules: [
    {
      times: [{ endTime: string; startTime: string; id: number }];
      date: string;
    },
  ];
}
