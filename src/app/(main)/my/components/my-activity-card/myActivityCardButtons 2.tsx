import { ReactNode } from 'react';

interface MyActivityCardButtonsProps {
  children: ReactNode;
}

export function MyActivityCardButtons({
  children,
}: MyActivityCardButtonsProps) {
  return <>{children}</>;
}
