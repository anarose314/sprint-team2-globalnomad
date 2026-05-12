export interface HeaderUser {
  name: string;
}

export interface HeaderProps {
  user?: HeaderUser;
  hasNotification?: boolean;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  isProfileMenuOpen?: boolean;
  profileMenuId?: string;
}
