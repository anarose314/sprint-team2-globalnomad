import type { ActivityCategory } from '@/app/(main)/activity/apis/activities.types';
import type { FilterCategory } from '@/shared/components/buttons';

export type MainCategoryValue =
  | 'art'
  | 'food'
  | 'sport'
  | 'tour'
  | 'bus'
  | 'wellbeing';

export type MainSortValue = 'price_asc' | 'price_desc';

export interface MainCategory {
  label: string;
  value: MainCategoryValue;
  apiValue: ActivityCategory;
  iconCategory: FilterCategory;
}

export interface MainSortOption {
  label: string;
  value: MainSortValue;
}
