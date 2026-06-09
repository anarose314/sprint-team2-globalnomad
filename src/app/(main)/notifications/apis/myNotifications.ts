import type {
  DeleteMyNotificationParams,
  FetchMyNotificationsParams,
  MyNotificationsResponse,
} from '@/app/(main)/notifications/apis/myNotifications.types';
import { MY_NOTIFICATIONS_SIZE } from '@/app/(main)/notifications/notifications.constants';
import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';

/**
 * 내 알림 목록을 조회하는 API 호출 함수 (BFF 경유)
 *
 * @example
 * fetchMyNotifications({ pageParam: null })
 */
export const fetchMyNotifications = async ({
  pageParam = null,
}: FetchMyNotificationsParams) => {
  const params = {
    size: MY_NOTIFICATIONS_SIZE,
    ...(pageParam !== null && { cursorId: pageParam }),
  };

  return fetchInstanceClient<MyNotificationsResponse>(
    '/api/proxy/my-notifications',
    { params }
  );
};

/**
 * 내 알림을 삭제하는 API 호출 함수 (BFF 경유)
 *
 * @example
 * deleteMyNotification({ notificationId: 1 })
 */
export const deleteMyNotification = async ({
  notificationId,
}: DeleteMyNotificationParams) => {
  await fetchInstanceClient<void>(
    `/api/proxy/my-notifications/${notificationId}`,
    {
      method: 'DELETE',
    }
  );
};
