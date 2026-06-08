export interface MyNotification {
  id: number;
  teamId: string;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface MyNotificationsResponse {
  cursorId: number | null;
  notifications: MyNotification[];
  totalCount: number;
}

export interface FetchMyNotificationsParams {
  pageParam?: number | null;
}

export interface DeleteMyNotificationParams {
  notificationId: number;
}
