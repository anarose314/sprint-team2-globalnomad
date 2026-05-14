import { ReactNode } from 'react';

interface ActivityCardLayoutProps {
  children: ReactNode;
}

export function ActivityCardLayout({ children }: ActivityCardLayoutProps) {
  return (
    <li className="border-b border-b-gray-50 pb-7.5 last:border-b-0 last:pb-0">
      <article className="flex flex-col gap-3">{children}</article>
    </li>
  );
}
