import type { MainCategory, MainSortOption } from '@/app/(main)/main.types';

const MAIN_BANNER_IMAGE_URL =
  'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/activity_registration_image/21-1_3229_1775042497661.png';

export const MAIN_BANNER = {
  imageUrl: MAIN_BANNER_IMAGE_URL,
  title: '함께 배우면 즐거운 스트릿 댄스',
  description: '1월의 인기 체험 BEST 🔥',
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
