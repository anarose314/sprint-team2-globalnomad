'use client';

import Link from 'next/link';
import { IcBellOff, IcBellOn, IcProfile } from '@/shared/assets/icons';
import { LogoHorizontal, LogoIcon } from '@/shared/assets/logos';
import { Button } from '@/shared/components/buttons/button';
import type { HeaderProps } from '@/shared/components/header/header.types';

/**
 * 메인 페이지 공통 Header 컴포넌트
 *
 * - 메인 라우트 그룹에서 공통으로 사용하는 상단 내비게이션 영역
 * - PC/태블릿에서는 가로형 로고를, 모바일에서는 아이콘 로고를 표시한다.
 * - 로그인 상태에서 알림, 프로필 아이콘, 유저 이름을 표시한다.
 * - 비로그인 상태에서는 로그인/회원가입 버튼을 표시한다.
 *
 * @example
 * <Header />
 *
 * @example
 * <Header user={{ name: '정만철' }} hasNotification />
 */
export function Header({
  user,
  hasNotification = false,
  onNotificationClick,
}: HeaderProps) {
  const BellIcon = hasNotification ? IcBellOn : IcBellOff;

  return (
    <header className="sticky top-0 z-50 h-12 shrink-0 border-b border-gray-50 bg-white md:h-20">
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

        {user ? (
          <div className="flex items-center gap-5">
            <button
              type="button"
              aria-label={
                hasNotification ? '새 알림이 있습니다' : '새 알림이 없습니다'
              }
              onClick={onNotificationClick}
              className="flex h-8 w-8 items-center justify-center"
            >
              <BellIcon
                className="block h-6 w-6 text-gray-600"
                aria-hidden="true"
              />
            </button>

            <div className="hidden h-5 w-px bg-gray-100 md:block" />

            <Link
              href="/my/profile"
              className="flex items-center gap-2 md:gap-3"
              aria-label={`${user.name}님의 마이페이지로 이동`}
            >
              <IcProfile className="h-8 w-8" aria-hidden="true" />

              <span className="typo-md-medium hidden text-gray-950 md:block">
                {user.name}
              </span>
            </Link>
          </div>
        ) : (
          <nav aria-label="인증 메뉴">
            <ul className="flex items-center gap-2 md:gap-3">
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
        )}
      </div>
    </header>
  );
}
