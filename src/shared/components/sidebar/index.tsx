'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IcEdit, IcProfile } from '@/shared/assets/icons';
import { Button } from '@/shared/components/buttons';
import { MENU_ITEMS } from '@/shared/components/sidebar/sidebar.constants';
import type { SidebarProps } from '@/shared/components/sidebar/sidebar.types';
import { cn } from '@/shared/utils/cn';

// TODO: 내 정보 API 연동 후 실제 프로필 이미지 URL로 교체
const MOCK_PROFILE_IMAGE_URL = '';

/**
 * 마이페이지에서 공용으로 사용하는 사이드바 컴포넌트.
 *
 * - 현재 경로에 해당하는 메뉴를 자동으로 활성화한다.
 * - 프로필 이미지, 프로필 이미지 수정, 로그아웃 등 사이드바 내부의 상태와 동작을 모두 자체적으로 관리한다.
 * - variant에 따라 데스크탑 사이드바와 모바일 드로어 내부 메뉴로 재사용한다.
 */
export function Sidebar({
  variant = 'desktop',
  onNavigate,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();
  const profileImageUrl = MOCK_PROFILE_IMAGE_URL;
  const isDrawer = variant === 'drawer';

  const handleProfileEdit = () => {
    // TODO: 프로필 수정 버튼 이벤트 연동 후 콘솔 로그 지우기
    console.warn('프로필 수정 클릭');
  };

  const handleLogout = () => {
    // TODO: 로그아웃 버튼 이벤트 연동 후 콘솔 로그 지우기
    console.warn('로그아웃 클릭');

    onLogout?.();
  };

  return (
    <aside
      className={cn(
        'bg-white',
        isDrawer
          ? 'flex h-full w-full flex-col px-5 pt-14 pb-5'
          : 'shadow-card hidden w-44.5 rounded-xl border border-gray-50 px-3.5 pt-4 pb-5 md:block 2xl:w-72.5 2xl:pt-6 2xl:pb-7'
      )}
    >
      {/* 프로필 영역 */}
      <div
        className={cn(
          'relative mx-auto w-fit',
          isDrawer ? 'mb-6' : 'mb-3 2xl:mb-6'
        )}
      >
        <div
          className={cn(
            'relative aspect-square overflow-hidden rounded-full bg-blue-50',
            isDrawer ? 'w-24' : 'w-17.5 2xl:w-28'
          )}
        >
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
              alt="프로필 이미지"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-blue-200">
              <IcProfile className="h-full w-full" aria-hidden="true" />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleProfileEdit}
          aria-label="프로필 이미지 수정"
          className={cn(
            'absolute right-1 bottom-1 flex cursor-pointer items-center justify-center rounded-full bg-gray-400 p-1.75 text-white transition-colors hover:bg-gray-500',
            isDrawer ? 'h-7.5 w-7.5' : 'h-6 w-6 2xl:h-7.5 2xl:w-7.5'
          )}
        >
          <IcEdit className="h-full w-full" aria-hidden="true" />
        </button>
      </div>

      {/* 메뉴 영역 */}
      <nav className="flex flex-col gap-3.5" aria-label="마이페이지 메뉴">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'typo-lg-medium px-em flex h-12 items-center gap-2 rounded-2xl transition-colors 2xl:h-13.5 2xl:rounded-2xl',
                isActive
                  ? 'bg-primary-100 [&_svg]:text-primary-500 text-gray-950'
                  : 'hover:bg-primary-100 text-gray-600 [&_svg]:text-gray-600'
              )}
            >
              <item.Icon className="h-6 w-6" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 로그아웃 버튼 */}
      <Button
        type="button"
        onClick={handleLogout}
        className={cn('mt-3.5 h-12 w-full 2xl:h-13.5', isDrawer && 'mt-auto')}
        size="lg"
        variant="secondary"
      >
        로그아웃
      </Button>
    </aside>
  );
}
