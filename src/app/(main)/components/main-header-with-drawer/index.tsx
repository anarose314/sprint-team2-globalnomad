'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NotificationDropdown } from '@/app/(main)/components/notification-dropdown/notificationDropdown';
import { useMyInfo } from '@/app/(main)/my/profile/hooks/useMyInfo';
import { useDeleteMyNotification } from '@/app/(main)/notifications/hooks/useDeleteMyNotification';
import { useMyNotifications } from '@/app/(main)/notifications/hooks/useMyNotifications';
import { Header } from '@/shared/components/header';
import type { HeaderUser } from '@/shared/components/header/header.types';
import { ModalOverlay } from '@/shared/components/modal/modal-overlay';
import { TwoButtonModal } from '@/shared/components/modal/TwoButtonModal';
import { SideDrawer } from '@/shared/components/side-drawer';
import { Sidebar } from '@/shared/components/sidebar';
import { useModal } from '@/shared/hooks/useModal';

const MOBILE_MY_MENU_ID = 'mobile-my-menu';
const NOTIFICATION_MENU_ID = 'header-notification-menu';

interface MainHeaderWithDrawerProps {
  user?: HeaderUser;
}

/**
 * 메인 라우트 그룹에서 사용하는 Header와 모바일 마이페이지 드로어를 연결하는 컴포넌트.
 *
 * - Header의 모바일 프로필 버튼 클릭 시 마이페이지 드로어를 연다.
 * - 알림 버튼 클릭 시 알림 드롭다운을 연다.
 * - 알림 드롭다운과 사이드 드로어는 동시에 열리지 않도록 제어한다.
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
}: MainHeaderWithDrawerProps) {
  const router = useRouter();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    number | null
  >(null);

  const { isOpen, openModal, closeModal } = useModal();
  const { mutate: deleteNotification, isPending: isDeletingNotification } =
    useDeleteMyNotification();

  const { data: queryUser } = useMyInfo({
    enabled: Boolean(initialUser),
  });

  const user = useMemo<HeaderUser | undefined>(() => {
    return queryUser
      ? {
          nickname: queryUser.nickname,
          profileImageUrl: queryUser.profileImageUrl,
        }
      : initialUser;
  }, [queryUser, initialUser]);

  const {
    data: notificationData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: isNotificationsPending,
    isError: isNotificationsError,
  } = useMyNotifications({
    enabled: Boolean(user),
  });

  const notifications = useMemo(() => {
    return notificationData?.pages.flatMap((page) => page.notifications) ?? [];
  }, [notificationData]);

  const totalNotificationCount = notificationData?.pages[0]?.totalCount ?? 0;
  const hasNotification = totalNotificationCount > 0;

  const openDrawer = useCallback(() => {
    setIsNotificationOpen(false);
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const toggleNotification = useCallback(() => {
    setIsDrawerOpen(false);
    setIsNotificationOpen((prev) => !prev);
  }, []);

  const closeNotification = useCallback(() => {
    setIsNotificationOpen(false);
  }, []);

  const handleLoadMoreNotifications = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleNotificationClick = useCallback(() => {
    closeNotification();
    router.push('/my/reservations');
  }, [closeNotification, router]);

  const handleDeleteClick = useCallback(
    (notificationId: number) => {
      setSelectedNotificationId(notificationId);
      openModal();
    },
    [openModal]
  );

  const handleConfirmDelete = useCallback(() => {
    if (selectedNotificationId === null || isDeletingNotification) {
      return;
    }

    deleteNotification(
      { notificationId: selectedNotificationId },
      {
        onSuccess: () => {
          closeModal();
          setSelectedNotificationId(null);
        },
      }
    );
  }, [
    closeModal,
    deleteNotification,
    isDeletingNotification,
    selectedNotificationId,
  ]);

  const handleCancelDelete = useCallback(() => {
    closeModal();
    setSelectedNotificationId(null);
  }, [closeModal]);

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
        onNotificationClick={toggleNotification}
        onNotificationClose={isOpen ? undefined : closeNotification}
        isNotificationOpen={isNotificationOpen}
        notificationMenuId={
          isNotificationOpen ? NOTIFICATION_MENU_ID : undefined
        }
        notificationDropdown={
          isNotificationOpen ? (
            <NotificationDropdown
              id={NOTIFICATION_MENU_ID}
              notifications={notifications}
              totalCount={totalNotificationCount}
              isPending={isNotificationsPending}
              isError={isNotificationsError}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              onClose={closeNotification}
              onLoadMore={handleLoadMoreNotifications}
              onNotificationClick={handleNotificationClick}
              onDeleteClick={handleDeleteClick}
            />
          ) : undefined
        }
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

      {isOpen && (
        <ModalOverlay onClose={handleCancelDelete}>
          <TwoButtonModal
            message="알림을 삭제하시겠습니까?"
            cancelText="아니오"
            confirmText={isDeletingNotification ? '삭제 중...' : '네'}
            onCancel={handleCancelDelete}
            onConfirm={handleConfirmDelete}
          />
        </ModalOverlay>
      )}
    </>
  );
}
