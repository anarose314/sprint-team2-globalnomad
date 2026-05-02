import { ComponentPropsWithRef } from 'react';

export interface TextareaProps extends ComponentPropsWithRef<'textarea'> {
  label?: string;
  errorMessage?: string;
}
