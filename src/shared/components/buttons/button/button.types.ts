import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { VariantProps } from 'class-variance-authority';
import { BUTTON_VARIANTS } from '@/shared/components/buttons/button/button.constants';

type CustomButtonProps<T extends ElementType> = {
  as?: T;
  icon?: ReactNode;
} & Omit<VariantProps<typeof BUTTON_VARIANTS>, 'variant'>;

export type BaseButtonProps<T extends ElementType> = CustomButtonProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof CustomButtonProps<T>>;

export type PrimaryButtonProps<T extends ElementType = 'button'> =
  BaseButtonProps<T> & {
    variant?: 'primary';
  };

export type SecondaryButtonProps<T extends ElementType = 'button'> =
  BaseButtonProps<T> & {
    variant: 'secondary';
  };

export type ButtonProps<T extends ElementType = 'button'> =
  | PrimaryButtonProps<T>
  | SecondaryButtonProps<T>;
