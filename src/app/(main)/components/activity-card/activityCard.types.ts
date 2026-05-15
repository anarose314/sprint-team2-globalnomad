export interface ActivityCardItem {
  id: number;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  bannerImageUrl?: string | null;
}

export interface ActivityCardProps {
  activity: ActivityCardItem;
}
