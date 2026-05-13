import { ComponentProps } from 'react';

export interface FormImageProps extends Omit<
  ComponentProps<'input'>,
  'onChange'
> {
  errorMessage?: string;
  isMultiple?: boolean;
  onChange?: (value: string | string[]) => void;
}
