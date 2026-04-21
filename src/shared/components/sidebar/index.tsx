'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IcEdit, IcProfile } from '@/shared/assets/icons';
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
    <aside className="shadow-card h-129.5 w-72.5 rounded-xl border border-gray-50 bg-white p-3.75">
      {/* 프로필 영역 */}
      <div className="relative mx-auto mt-3 mb-6 w-fit">
        <div className="relative h-28 w-28 overflow-hidden rounded-full bg-blue-50">
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
              alt="프로필 이미지"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-blue-200">
              <IcProfile />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleProfileEdit}
          aria-label="프로필 이미지 수정"
          className="absolute right-1 bottom-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-400 text-white transition-colors hover:bg-gray-500"
        >
          <IcEdit />
        </button>
      </div>

      {/* 메뉴 영역 */}
      <nav className="flex flex-col gap-1">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`typo-lg-medium mb-1 flex items-center gap-2 rounded-2xl px-5 py-3.75 transition-colors ${
                isActive
                  ? 'bg-primary-100 [&_svg]:text-primary-500 text-gray-950'
                  : 'hover:bg-primary-100 text-gray-600 [&_svg]:text-gray-600'
              }`}
            >
              <item.Icon />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 로그아웃 버튼 */}
      {/* TODO: 이후 공통 버튼 컴포넌트로 변경해야 함 */}
      <button
        type="button"
        onClick={handleLogout}
        className="typo-lg-medium mt-4 w-full cursor-pointer rounded-2xl border border-gray-100 py-3.5 text-gray-400 transition-colors hover:bg-gray-50"
      >
        로그아웃
      </button>
    </aside>
  );
}
