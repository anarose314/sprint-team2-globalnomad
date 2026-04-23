import { ButtonHTMLAttributes } from 'react';
import { VariantProps } from 'class-variance-authority';
import {
  CATEGORY_ICON_MAP,
  filterButtonVariants,
} from '@/shared/components/buttons/filter-button/filterButton.constants';

/** 카테고리 필터 버튼에 사용 가능한 카테고리 종류 */
export type FilterCategory = keyof typeof CATEGORY_ICON_MAP;

export interface FilterButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof filterButtonVariants> {
  /** 버튼에 표시할 텍스트 레이블 */
  label: string;
  /**
   * 카테고리 종류
   * - `'art'` : 아트/문화
   * - `'food'` : 음식/음료
   * - `'bus'` : 버스/투어
   * - `'sport'` : 스포츠
   * - `'tour'` : 관광
   * - `'wellbeing'` : 웰빙
   */
  category?: FilterCategory;
  /**
   * 아이콘 표시 여부
   * @defaultValue `true`
   */
  showIcon?: boolean;
}
