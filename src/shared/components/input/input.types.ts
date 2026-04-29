import { ComponentPropsWithRef, ReactNode } from 'react';

export interface InputProps extends ComponentPropsWithRef<'input'> {
  label?: string;
  errorMessage?: string;
  rightIcon?: ReactNode;
  isPasswordToggle?: boolean;
}
