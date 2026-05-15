export interface ActivitySubImage {
  id: number;
  imageUrl: string;
}

export interface ActivitySchedule {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface ActivityAvailableScheduleTime {
  id: number;
  startTime: string;
  endTime: string;
}

export interface ActivityAvailableScheduleItem {
  date: string;
  times: ActivityAvailableScheduleTime[];
}

export interface ActivityDetailResponse {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  subImages: ActivitySubImage[] | null;
  schedules: ActivitySchedule[];
  reviewCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}
