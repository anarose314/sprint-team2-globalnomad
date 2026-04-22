import { ButtonHTMLAttributes, ReactNode } from 'react';
import { VariantProps } from 'class-variance-authority';
import { BUTTON_VARIANTS } from '@/shared/components/buttons/button/button.constants';

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 왼쪽에 표시할 아이콘 */
  icon?: ReactNode;
}

export interface PrimaryButtonProps
  extends
    BaseButtonProps,
    Omit<VariantProps<typeof BUTTON_VARIANTS>, 'variant'> {
  variant?: 'primary';
  isActive?: never;
}

export interface SecondaryButtonProps
  extends
    BaseButtonProps,
    Omit<VariantProps<typeof BUTTON_VARIANTS>, 'variant'> {
  variant: 'secondary';
  isActive?: never;
}

export interface TextButtonProps
  extends
    BaseButtonProps,
    Omit<VariantProps<typeof BUTTON_VARIANTS>, 'variant'> {
  variant: 'text';
  /** 버튼 선택 여부 */
  isActive?: boolean;
}

export interface ArrowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'arrow';
  /** 화살표 방향 */
  direction: 'left' | 'right';
  /** 활성 여부 — true: gray_800 / false: gray_300 */
  isActive?: boolean;
}

export interface ArrowNavigationButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'arrow_navigation';
  /** 화살표 방향 */
  direction: 'left' | 'right';
  /** 활성 여부 — true: gray_800 / false: gray_300 */
  isActive?: boolean;
}

export interface AddButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'btn_add';
  /**
   * - `'pc'`: PC/TB 사이즈 (128×128) 고정
   * - `'mb'`: 모바일 사이즈 (80×80) 고정
   * - `undefined`: 반응형 (기본 80×80, md: 이상 128×128)
   */
  size?: 'pc' | 'mb';
}

export type ButtonProps =
  | PrimaryButtonProps
  | SecondaryButtonProps
  | TextButtonProps
  | ArrowButtonProps
  | ArrowNavigationButtonProps
  | AddButtonProps;
