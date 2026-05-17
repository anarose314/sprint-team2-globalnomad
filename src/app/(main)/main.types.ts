import type { ComponentType, SVGProps } from 'react';
import type { ActivityCategory } from '@/app/(main)/activity/apis/activities.types';

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
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export interface MainSortOption {
  label: string;
  value: MainSortValue;
}
