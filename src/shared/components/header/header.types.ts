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
  onProfileClick?: () => void;
  isProfileMenuOpen?: boolean;
  profileMenuId?: string;
}
