'use client';

import Link from 'next/link';
import { LogoHorizontal, LogoIcon } from '@/shared/assets/logos';
import { Button } from '@/shared/components/buttons/button';

/**
 * 메인 페이지 공통 Header 컴포넌트
 *
 * - 메인 라우트 그룹에서 공통으로 사용하는 상단 내비게이션 영역
 * - PC/태블릿에서는 가로형 로고를, 모바일에서는 아이콘 로고를 표시한다.
 *
 * @example
 * <Header />
 */
export function Header() {
  return (
    <header className="z-header h-12 shrink-0 border-b border-gray-50 bg-white md:h-20">
      <div className="mx-auto flex h-full w-full max-w-380 items-center justify-between px-4 md:px-10 2xl:px-0">
        <Link
          href="/"
          aria-label="메인 페이지로 이동"
          className="flex h-8 w-8 shrink-0 items-center justify-center md:h-7 md:w-43.5"
        >
          <LogoIcon className="block h-8 w-8 md:hidden" aria-hidden="true" />
          <LogoHorizontal
            className="hidden h-7 w-43.5 md:block"
            aria-hidden="true"
          />
        </Link>

        <nav aria-label="인증 메뉴">
          <ul className="flex items-center gap-2 min-[375px]:gap-3">
            <li>
              <Button
                as={Link}
                href="/login"
                variant="secondary"
                size="sm"
                className="w-20"
              >
                로그인
              </Button>
            </li>
            <li>
              <Button
                as={Link}
                href="/signup"
                variant="primary"
                size="sm"
                className="w-20"
              >
                회원가입
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
