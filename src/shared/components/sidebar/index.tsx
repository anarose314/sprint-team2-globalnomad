'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IcEdit, IcProfile } from '@/shared/assets/icons';
import { Button } from '@/shared/components/buttons';
import { MENU_ITEMS } from '@/shared/components/sidebar/sidebar.constants';

// TODO: 내 정보 API 연동 후 실제 프로필 이미지 URL로 교체
const MOCK_PROFILE_IMAGE_URL = '';

/**
 * 마이페이지에서 공용으로 사용하는 사이드바 컴포넌트.
 * - 현재 경로에 해당하는 메뉴를 자동으로 활성화한다.
 * - 프로필 이미지, 프로필 이미지 수정, 로그아웃 등 사이드바 내부의 상태와 동작을 모두 자체적으로 관리한다.
 */
export function Sidebar() {
  const pathname = usePathname();
  const profileImageUrl = MOCK_PROFILE_IMAGE_URL;

  const handleProfileEdit = () => {
    // TODO: 프로필 수정 버튼 이벤트 연동 후 콘솔 로그 지우기
    console.warn('프로필 수정 클릭');
  };

  const handleLogout = () => {
    // TODO: 로그아웃 버튼 이벤트 연동 후 콘솔 로그 지우기
    console.warn('로그아웃 클릭');
  };

  return (
    <aside className="shadow-card hidden w-44.5 rounded-xl border border-gray-50 bg-white px-3.5 py-4 md:block lg:w-72.5 lg:py-6">
      {/* 프로필 영역 */}
      <div className="relative mx-auto mb-3 w-fit lg:mb-6">
        <div className="relative aspect-square w-17.5 overflow-hidden rounded-full bg-blue-50 lg:w-28">
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
              alt="프로필 이미지"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-blue-200">
              <IcProfile className="h-full w-full" />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleProfileEdit}
          aria-label="프로필 이미지 수정"
          className="absolute right-1 bottom-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-gray-400 p-1.75 text-white transition-colors hover:bg-gray-500 lg:h-7.5 lg:w-7.5"
        >
          <IcEdit className="h-full w-full" />
        </button>
      </div>

      {/* 메뉴 영역 */}
      <nav className="flex flex-col gap-3.5">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`typo-lg-medium flex h-12 items-center gap-2 rounded-[14px] px-[1em] transition-colors lg:h-13.5 lg:rounded-2xl ${
                isActive
                  ? 'bg-primary-100 [&_svg]:text-primary-500 text-gray-950'
                  : 'hover:bg-primary-100 text-gray-600 [&_svg]:text-gray-600'
              }`}
            >
              <item.Icon className="h-6 w-6" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 로그아웃 버튼 */}
      <Button
        type="button"
        onClick={handleLogout}
        className="mt-3.5 h-12 w-full lg:h-13.5"
        size="lg"
        variant="secondary"
      >
        로그아웃
      </Button>
    </aside>
  );
}
