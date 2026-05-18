import type { MainSortOption } from '@/app/(main)/main.types';

export const MAIN_BANNER = {
  title: 'FIND YOUR EXPERIENCE',
  description: '당신만의 특별한 체험을 발견하세요',
};

export const MAIN_SORT_OPTIONS: MainSortOption[] = [
  { label: '낮은 가격 순', value: 'price_asc' },
  { label: '높은 가격 순', value: 'price_desc' },
];

export const MAIN_PAGE_SIZE = 6;

export const MAIN_DESKTOP_PAGE_SIZE = 8;

export const MAIN_DESKTOP_PAGE_SIZE_MEDIA_QUERY = '(min-width: 1536px)';

export const POPULAR_ACTIVITY_PAGE_SIZE = 4;
