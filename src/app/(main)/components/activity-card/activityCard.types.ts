export interface ActivityCardItem {
  id: number;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  bannerImageUrl: string;
}

export interface ActivityCardProps {
  activity: ActivityCardItem;
}
