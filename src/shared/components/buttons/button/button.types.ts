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
}

export interface SecondaryButtonProps
  extends
    BaseButtonProps,
    Omit<VariantProps<typeof BUTTON_VARIANTS>, 'variant'> {
  variant: 'secondary';
}

export type ButtonProps = PrimaryButtonProps | SecondaryButtonProps;
