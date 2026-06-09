'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IcBellOff, IcBellOn } from '@/shared/assets/icons';
import { LogoHorizontal, LogoIcon } from '@/shared/assets/logos';
import { Button } from '@/shared/components/buttons/button';
import type { HeaderProps } from '@/shared/components/header/header.types';
import { HeaderProfileAvatar } from '@/shared/components/header/headerProfileAvatar';
import { HeaderProfileDropdown } from '@/shared/components/header/headerProfileDropdown';

/**
 * 메인 페이지 공통 Header 컴포넌트
 *
 * - 메인 라우트 그룹에서 공통으로 사용하는 상단 내비게이션 영역
 * - PC/태블릿에서는 가로형 로고를, 모바일에서는 아이콘 로고를 표시한다.
 * - 로그인 상태에서는 알림, 프로필 이미지, 유저 닉네임을 표시한다.
 * - 모바일 로그인 상태에서는 프로필 아이콘 클릭 시 외부에서 주입한 메뉴 열기 동작을 실행할 수 있다.
 * - 비로그인 상태에서는 로그인/회원가입 버튼을 표시한다.
 * - 알림 목록 열기/닫기 동작과 드롭다운 UI는 외부에서 주입한다.
 *
 * @example
 * <Header />
 *
 * @example
 * <Header
 *   user={{ nickname: '정만철', profileImageUrl: null }}
 *   hasNotification
 *   onNotificationClick={handleNotificationClick}
 * />
 */
export function Header({
  user,
  hasNotification = false,
  onNotificationClick,
  onNotificationClose,
  isNotificationOpen = false,
  notificationMenuId,
  notificationDropdown,
  onProfileClick,
  isProfileMenuOpen = false,
  profileMenuId,
}: HeaderProps) {
  const pathname = usePathname();
  const notificationAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isNotificationOpen || !onNotificationClose) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (notificationAreaRef.current?.contains(event.target as Node)) {
        return;
      }

      onNotificationClose();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onNotificationClose();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isNotificationOpen, onNotificationClose]);

  return (
    <header className="z-header sticky top-0 h-14 shrink-0 border-b border-gray-50 bg-white px-6 md:h-20">
      <div className="mx-auto flex h-full w-full max-w-380 items-center justify-between">
        <h1 className="flex shrink-0 items-center justify-center">
          <Link
            href="/"
            aria-label="메인 페이지로 이동"
            className="flex w-9 items-center justify-center p-1 md:w-43.5 md:p-0"
          >
            <LogoIcon className="h-full w-full md:hidden" aria-hidden="true" />
            <LogoHorizontal
              className="hidden h-full w-full md:block"
              aria-hidden="true"
            />
          </Link>
        </h1>

        {user ? (
          <div className="flex items-center gap-5">
            {onNotificationClick && (
              <div ref={notificationAreaRef} className="relative">
                <button
                  type="button"
                  onClick={onNotificationClick}
                  aria-label={isNotificationOpen ? '알림 닫기' : '알림 열기'}
                  aria-expanded={isNotificationOpen}
                  aria-controls={
                    isNotificationOpen ? notificationMenuId : undefined
                  }
                  className="flex size-8 cursor-pointer items-center justify-center text-gray-500 transition-colors hover:text-gray-950"
                >
                  {hasNotification ? (
                    <IcBellOn aria-hidden="true" className="size-6" />
                  ) : (
                    <IcBellOff aria-hidden="true" className="size-6" />
                  )}
                </button>

                {isNotificationOpen && notificationDropdown}
              </div>
            )}

            <div className="md:hidden">
              {onProfileClick ? (
                <button
                  type="button"
                  onClick={onProfileClick}
                  aria-label={`${user.nickname}님의 마이페이지 메뉴 열기`}
                  aria-expanded={isProfileMenuOpen}
                  aria-controls={profileMenuId}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <HeaderProfileAvatar user={user} />
                </button>
              ) : (
                <Link
                  href="/my/profile"
                  className="flex items-center gap-2"
                  aria-label={`${user.nickname}님의 마이페이지로 이동`}
                >
                  <HeaderProfileAvatar user={user} />
                </Link>
              )}
            </div>

            <div className="hidden md:block">
              <HeaderProfileDropdown user={user} />
            </div>
          </div>
        ) : (
          <nav aria-label="인증 메뉴">
            <ul className="flex items-center gap-2 md:gap-3">
              <li>
                <Button
                  as={Link}
                  href={`/login?from=${encodeURIComponent(pathname)}`}
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
                  href={`/signup?from=${encodeURIComponent(pathname)}`}
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
