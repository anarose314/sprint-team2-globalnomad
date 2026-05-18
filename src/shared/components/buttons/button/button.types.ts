import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { BUTTON_VARIANTS } from '@/shared/components/buttons/button/button.constants';

type ButtonVariantKeys = keyof VariantProps<typeof BUTTON_VARIANTS>;

export type ButtonProps<T extends ElementType = 'button'> = {
  as?: T;
  icon?: ReactNode;
} & VariantProps<typeof BUTTON_VARIANTS> &
  Omit<ComponentPropsWithoutRef<T>, 'as' | 'icon' | ButtonVariantKeys>;
