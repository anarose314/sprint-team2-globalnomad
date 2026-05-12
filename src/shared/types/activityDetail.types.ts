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

export interface ActivityDetailResponse {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  subImages: ActivitySubImage[];
  schedules: ActivitySchedule[];
  reviewCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}
