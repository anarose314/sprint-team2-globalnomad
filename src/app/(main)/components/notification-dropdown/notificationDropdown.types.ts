import type { MyNotification } from '@/app/(main)/notifications/apis/myNotifications.types';

export interface NotificationDropdownProps {
  id?: string;
  notifications: MyNotification[];
  totalCount: number;
  isPending?: boolean;
  isError?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onClose: () => void;
  onLoadMore?: () => void;
  onNotificationClick: (notification: MyNotification) => void;
  onDeleteClick: (notificationId: number) => void;
}
