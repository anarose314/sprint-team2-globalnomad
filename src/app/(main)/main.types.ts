import type { FilterCategory } from '@/shared/components/buttons';

export type MainCategoryValue = 'art' | 'food' | 'tour' | 'bus' | 'wellbeing';

export interface MainActivity {
  id: number;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  bannerImageUrl: string;
  category: MainCategoryValue;
}

export interface MainCategory {
  label: string;
  value: MainCategoryValue;
  iconCategory: FilterCategory;
}

export interface MainSortOption {
  label: string;
  value: string;
}
