import { ComponentProps } from 'react';

export interface FormImageProps extends Omit<
  ComponentProps<'input'>,
  'onChange'
> {
  errorMessage?: string;
  isMultiple?: boolean;
  onChange?: (file: File[] | File | null) => void;
}
