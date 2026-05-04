export interface NotificationItem {
  id: number;
  teamId: string;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface NotificationResponse {
  cursorId: number;
  notifications: NotificationItem[];
  totalCount: number;
}

export interface NotificationDropdownProps {
  data?: NotificationResponse;
  onClose?: () => void;
}
