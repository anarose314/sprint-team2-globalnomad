import type { MainCategory, MainSortOption } from '@/app/(main)/main.types';

export const MAIN_BANNER = {
  title: 'FIND YOUR EXPERIENCE',
  description: '당신만의 특별한 체험을 발견하세요',
};

export const MAIN_CATEGORIES: MainCategory[] = [
  {
    label: '문화 · 예술',
    value: 'art',
    apiValue: '문화 · 예술',
    iconCategory: 'art',
  },
  {
    label: '식음료',
    value: 'food',
    apiValue: '식음료',
    iconCategory: 'food',
  },
  {
    label: '스포츠',
    value: 'sport',
    apiValue: '스포츠',
    iconCategory: 'sport',
  },
  {
    label: '투어',
    value: 'tour',
    apiValue: '투어',
    iconCategory: 'tour',
  },
  {
    label: '관광',
    value: 'bus',
    apiValue: '관광',
    iconCategory: 'bus',
  },
  {
    label: '웰빙',
    value: 'wellbeing',
    apiValue: '웰빙',
    iconCategory: 'wellbeing',
  },
];

export const MAIN_SORT_OPTIONS: MainSortOption[] = [
  { label: '낮은 가격 순', value: 'price_asc' },
  { label: '높은 가격 순', value: 'price_desc' },
];

export const MAIN_PAGE_SIZE = 6;

export const MAIN_DESKTOP_PAGE_SIZE = 8;

export const MAIN_DESKTOP_PAGE_SIZE_MEDIA_QUERY = '(min-width: 1536px)';

export const POPULAR_ACTIVITY_PAGE_SIZE = 4;
