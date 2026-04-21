'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IcCalendar,
  IcEdit,
  IcList,
  IcProfile,
  IcSetting,
  IcUser,
} from '@/shared/assets/icons';

/**
 * 사이드바에 표시되는 메뉴 항목의 타입
 */
type MenuItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

/**
 * 사이드바에 표시할 메뉴 목록.
 * 메뉴가 추가/변경될 때 이 배열만 수정.
 */
const MENU_ITEMS: MenuItem[] = [
  { href: '/my/profile', label: '내 정보', icon: <IcUser /> },
  {
    href: '/my/reservations',
    label: '예약 내역',
    icon: <IcList />,
  },
  {
    href: '/my/activities',
    label: '내 체험 관리',
    icon: <IcSetting />,
  },
  {
    href: '/my/activities-dashboard',
    label: '예약 현황',
    icon: <IcCalendar />,
  },
];

/**
 * 사이드바 컴포넌트의 Props
 */
type SidebarProps = {
  /** 프로필 이미지 URL. 없으면 기본 아이콘이 표시된다. */
  profileImageUrl?: string;
  /** 프로필 이미지 수정 버튼 클릭 시 호출되는 핸들러 */
  onProfileEdit?: () => void;
  /** 로그아웃 버튼 클릭 시 호출되는 핸들러 */
  onLogout?: () => void;
};

/**
 * 마이페이지에서 공용으로 사용하는 사이드바 컴포넌트.
 *
 * - 현재 경로에 해당하는 메뉴를 자동으로 활성화한다.
 * - 프로필 이미지 수정/로그아웃 같은 동작은 props 핸들러로 외부에서 받는다.
 */
export default function Sidebar({
  profileImageUrl,
  onProfileEdit,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="h-129.5 w-72.5 rounded-xl border border-gray-50 bg-white p-3.75 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
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
          onClick={onProfileEdit}
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
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 로그아웃 버튼 */}
      <button
        type="button"
        onClick={onLogout}
        className="typo-lg-medium mt-4 w-full cursor-pointer rounded-2xl border border-gray-100 py-3.5 text-gray-400 transition-colors hover:bg-gray-50"
      >
        로그아웃
      </button>
    </aside>
  );
}
