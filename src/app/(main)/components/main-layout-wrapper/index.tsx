'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/utils/cn';

interface MainLayoutWrapperProps {
  children: ReactNode;
}

/**
 * 메인 라우트 공통 콘텐츠 레이아웃 래퍼
 *
 * - 공통 main 너비와 좌우 여백을 관리한다.
 * - 메인 페이지('/')에서만 배경색을 적용한다.
 *
 * @example
 * <MainLayoutWrapper>{children}</MainLayoutWrapper>
 */
export function MainLayoutWrapper({ children }: MainLayoutWrapperProps) {
  const pathname = usePathname();
  const isMainPage = pathname === '/';

  return (
    <div
      className={cn(
        'flex w-full grow px-6 md:px-7.5',
        isMainPage && 'bg-primary-25'
      )}
    >
      <main className="mx-auto flex w-full max-w-280 flex-col">{children}</main>
    </div>
  );
}
