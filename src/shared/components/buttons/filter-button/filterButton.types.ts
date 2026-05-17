import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { filterButtonVariants } from '@/shared/components/buttons/filter-button/filterButton.constants';

export type FilterButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof filterButtonVariants> & {
    label: string;
    icon?: ReactNode;
  };
