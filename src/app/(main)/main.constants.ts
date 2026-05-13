import type {
  MainActivity,
  MainCategory,
  MainSortOption,
} from '@/app/(main)/main.types';

const DUMMY_IMAGE_URL =
  'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/activity_registration_image/21-1_3229_1775042497661.png';

export const MAIN_BANNER = {
  imageUrl: DUMMY_IMAGE_URL,
  title: '함께 배우면 즐거운 스트릿 댄스',
  description: '1월의 인기 체험 BEST 🔥',
};

export const MAIN_CATEGORIES: MainCategory[] = [
  { label: '문화 · 예술', value: 'art', iconCategory: 'art' },
  { label: '식음료', value: 'food', iconCategory: 'food' },
  { label: '투어', value: 'tour', iconCategory: 'tour' },
  { label: '관광', value: 'bus', iconCategory: 'bus' },
  { label: '웰빙', value: 'wellbeing', iconCategory: 'wellbeing' },
];

export const MAIN_SORT_OPTIONS: MainSortOption[] = [
  { label: '낮은 가격 순', value: 'price_asc' },
  { label: '높은 가격 순', value: 'price_desc' },
];

export const MAIN_PAGE_SIZE = 6;

export const MAIN_DESKTOP_PAGE_SIZE = 8;

export const MAIN_DESKTOP_PAGE_SIZE_MEDIA_QUERY = '(min-width: 1536px)';

// TODO: 인기 체험 API 연동 시 더미 체험 목록 제거
export const MAIN_ACTIVITIES: MainActivity[] = [
  {
    id: 1,
    title: '함께 배우면 즐거운 스트릿 댄스',
    price: 38000,
    rating: 4.9,
    reviewCount: 703,
    bannerImageUrl: DUMMY_IMAGE_URL,
    category: 'art',
  },
  {
    id: 2,
    title: '연인과 사랑의 징검다리 건너기',
    price: 35000,
    rating: 3.9,
    reviewCount: 108,
    bannerImageUrl: DUMMY_IMAGE_URL,
    category: 'tour',
  },
  {
    id: 3,
    title: '피오르 체험',
    price: 42800,
    rating: 3.9,
    reviewCount: 108,
    bannerImageUrl: DUMMY_IMAGE_URL,
    category: 'tour',
  },
  {
    id: 4,
    title: '해안가 마을에서 1주일 살아보기',
    price: 217000,
    rating: 2.9,
    reviewCount: 67,
    bannerImageUrl: DUMMY_IMAGE_URL,
    category: 'bus',
  },
  {
    id: 5,
    title: '부모님과 함께 갈대숲 체험',
    price: 6000,
    rating: 4.0,
    reviewCount: 31,
    bannerImageUrl: DUMMY_IMAGE_URL,
    category: 'wellbeing',
  },
  {
    id: 6,
    title: '열기구 페스티벌',
    price: 35000,
    rating: 4.8,
    reviewCount: 85,
    bannerImageUrl: DUMMY_IMAGE_URL,
    category: 'tour',
  },
];

export const POPULAR_ACTIVITIES = MAIN_ACTIVITIES.slice(0, 4);
