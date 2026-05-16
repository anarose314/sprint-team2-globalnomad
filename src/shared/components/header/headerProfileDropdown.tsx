'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IcArrowDown } from '@/shared/assets/icons';
import type { HeaderProfileDropdownProps } from '@/shared/components/header/header.types';
import { HeaderProfileAvatar } from '@/shared/components/header/headerProfileAvatar';
import { MENU_ITEMS } from '@/shared/components/sidebar/sidebar.constants';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import { useEscapeKey } from '@/shared/hooks/useEscapeKey';
import { useLogoutMutation } from '@/shared/hooks/useLogoutMutation';
import { cn } from '@/shared/utils/cn';

/**
 * 헤더 데스크탑 영역의 프로필 드롭다운.
 *
 * - 트리거(프로필 이미지 + 닉네임) 클릭 시 마이페이지 메뉴와 로그아웃을 드롭다운으로 표시한다.
 * - 메뉴 항목은 사이드바와 동일한 `MENU_ITEMS` 데이터를 공유한다.
 * - 바깥 영역 클릭 또는 ESC 키로 닫힌다.
 *
 * 모바일(md 미만)에서는 별도의 메뉴 UI를 사용하므로 이 컴포넌트는 데스크탑 전용이다.
 */
export function HeaderProfileDropdown({ user }: HeaderProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const { mutate: logout, isPending } = useLogoutMutation();

  const close = () => setIsOpen(false);
  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleMenuItemClick = () => close();
  const handleLogoutClick = () => {
    if (isPending) return;
    logout();
    close();
  };

  useClickOutside(containerRef, close);
  useEscapeKey(close, isOpen);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`${user.nickname}님의 마이페이지 메뉴 열기`}
        onClick={handleToggle}
        className="flex cursor-pointer items-center gap-3"
      >
        <HeaderProfileAvatar user={user} />
        <span className="typo-md-medium text-gray-950">{user.nickname}</span>
        <IcArrowDown
          aria-hidden="true"
          className={cn(
            'size-5 shrink-0 text-gray-600 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <ul
          role="menu"
          className="absolute top-full right-0 mt-2 w-50 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
        >
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href} role="none">
                <Link
                  href={item.href}
                  role="menuitem"
                  onClick={handleMenuItemClick}
                  className={cn(
                    'typo-md-medium flex items-center gap-2 px-4 py-3 transition-colors',
                    isActive
                      ? 'bg-primary-100 text-primary-500 [&_svg]:text-primary-500'
                      : 'text-gray-500 hover:bg-gray-50 [&_svg]:text-gray-600'
                  )}
                >
                  <item.Icon className="size-6 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}

          <li role="none" className="border-t border-gray-100">
            <button
              type="button"
              role="menuitem"
              disabled={isPending}
              onClick={handleLogoutClick}
              className="typo-md-medium flex w-full cursor-pointer items-center justify-center px-4 py-3 text-center text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              로그아웃
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
