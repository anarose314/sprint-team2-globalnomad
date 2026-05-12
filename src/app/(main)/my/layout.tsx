import type { ReactNode } from 'react';
import { Sidebar } from '@/shared/components/sidebar';

export default function MyPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto mt-10 flex w-full max-w-245 items-start md:gap-7.5 2xl:gap-12.5">
      <div className="hidden h-fit md:sticky md:top-24 md:block md:self-start">
        <Sidebar />
      </div>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
