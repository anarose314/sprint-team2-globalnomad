// 개별 체험 아이템
export interface Activities {
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
}

// API 응답 데이터
export interface MyActivitiesResponse {
  cursorId: number | null;
  totalCount: number;
  activities: Activities[];
}
