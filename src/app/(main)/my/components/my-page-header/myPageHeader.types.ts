import { ReactNode } from 'react';

export interface MyPageHeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}
