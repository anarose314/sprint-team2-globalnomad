'use client';

import { useCallback, useEffect, useState } from 'react';
import { Header } from '@/shared/components/header';
import type { HeaderUser } from '@/shared/components/header/header.types';
import { SideDrawer } from '@/shared/components/side-drawer';
import { Sidebar } from '@/shared/components/sidebar';

const MOBILE_MY_MENU_ID = 'mobile-my-menu';

interface MainHeaderWithDrawerProps {
  user?: HeaderUser;
  hasNotification?: boolean;
  onNotificationClick?: () => void;
}

/**
 * 메인 라우트 그룹에서 사용하는 Header와 모바일 마이페이지 드로어를 연결하는 컴포넌트.
 *
 * - Header의 모바일 프로필 버튼 클릭 시 마이페이지 드로어를 연다.
 * - 메뉴 이동, 로그아웃 버튼 클릭, md 이상 화면 전환 시 드로어를 닫는다.
 */
export function MainHeaderWithDrawer({
  user,
  hasNotification = false,
  onNotificationClick,
}: MainHeaderWithDrawerProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      if (!event.matches) return;

      closeDrawer();
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, [closeDrawer]);

  return (
    <>
      <Header
        user={user}
        hasNotification={hasNotification}
        onNotificationClick={onNotificationClick}
        onProfileClick={openDrawer}
        isProfileMenuOpen={isDrawerOpen}
        profileMenuId={isDrawerOpen ? MOBILE_MY_MENU_ID : undefined}
      />

      {user && isDrawerOpen && (
        <SideDrawer
          id={MOBILE_MY_MENU_ID}
          onClose={closeDrawer}
          ariaLabel="마이페이지 메뉴"
        >
          <Sidebar
            variant="drawer"
            onNavigate={closeDrawer}
            onLogout={closeDrawer}
          />
        </SideDrawer>
      )}
    </>
  );
}
