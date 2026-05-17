import type { MainCategory } from '@/app/(main)/main.types';
import {
  IcArt,
  IcBus,
  IcFood,
  IcSport,
  IcTour,
  IcWellbeing,
} from '@/shared/assets/icons';

/** 메인 체험 목록 카테고리 필터(아이콘 포함) — 클라이언트 섹션에서만 import */
export const MAIN_CATEGORIES: MainCategory[] = [
  {
    label: '문화 · 예술',
    value: 'art',
    apiValue: '문화 · 예술',
    Icon: IcArt,
  },
  {
    label: '식음료',
    value: 'food',
    apiValue: '식음료',
    Icon: IcFood,
  },
  {
    label: '스포츠',
    value: 'sport',
    apiValue: '스포츠',
    Icon: IcSport,
  },
  {
    label: '투어',
    value: 'tour',
    apiValue: '투어',
    Icon: IcTour,
  },
  {
    label: '관광',
    value: 'bus',
    apiValue: '관광',
    Icon: IcBus,
  },
  {
    label: '웰빙',
    value: 'wellbeing',
    apiValue: '웰빙',
    Icon: IcWellbeing,
  },
];
