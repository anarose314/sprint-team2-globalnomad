import type { ReactNode } from 'react';

export interface HeaderUser {
  nickname: string;
  profileImageUrl: string | null;
}

export interface HeaderProfileAvatarProps {
  user: HeaderUser;
}

export interface HeaderProps {
  user?: HeaderUser;
  hasNotification?: boolean;
  onNotificationClick?: () => void;
  onNotificationClose?: () => void;
  isNotificationOpen?: boolean;
  notificationMenuId?: string;
  notificationDropdown?: ReactNode;
  onProfileClick?: () => void;
  isProfileMenuOpen?: boolean;
  profileMenuId?: string;
}

export interface HeaderProfileDropdownProps {
  user: HeaderUser;
}
