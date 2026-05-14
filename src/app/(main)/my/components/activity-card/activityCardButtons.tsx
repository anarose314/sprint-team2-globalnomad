import { ReactNode } from 'react';

interface ActivityCardButtonsProps {
  children: ReactNode;
}

export function ActivityCardButtons({ children }: ActivityCardButtonsProps) {
  return <>{children}</>;
}
