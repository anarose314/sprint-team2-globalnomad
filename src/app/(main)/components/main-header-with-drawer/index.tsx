'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMyInfo } from '@/app/(main)/my/profile/hooks/useMyInfo';
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
 * - 서버에서 prefetch한 initialUser를 기본으로 표시하되,
 *   React Query 캐시(useMyInfo)에 더 신선한 데이터가 있으면 그것을 우선한다.
 *   이를 통해 마이페이지에서 프로필 변경 시 헤더도 자동 동기화된다.
 *
 * @example
 * <MainHeaderWithDrawer user={user} />
 */
export function MainHeaderWithDrawer({
  user: initialUser,
  hasNotification = false,
  onNotificationClick,
}: MainHeaderWithDrawerProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 비로그인 상태에서는 useMyInfo 호출 시 401이 발생하므로,
  // 서버에서 user가 확인된 경우(initialUser 존재)에만 클라이언트 캐시 조회를 활성화한다.
  const { data: queryUser } = useMyInfo({
    enabled: Boolean(initialUser),
  });

  // 클라이언트 캐시 데이터가 있으면 그것을, 없으면 서버에서 받은 초기값을 사용한다.
  const user = useMemo<HeaderUser | undefined>(() => {
    return queryUser
      ? {
          nickname: queryUser.nickname,
          profileImageUrl: queryUser.profileImageUrl,
        }
      : initialUser;
  }, [queryUser, initialUser]);

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
