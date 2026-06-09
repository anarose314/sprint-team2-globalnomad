import {
  infiniteQueryOptions,
  keepPreviousData,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { fetchMyNotifications } from '@/app/(main)/notifications/apis/myNotifications';
import { MY_NOTIFICATIONS_SIZE } from '@/app/(main)/notifications/notifications.constants';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';

const NOTIFICATIONS_STALE_TIME = 60 * 1000;

/**
 * 내 알림 목록 쿼리 옵션
 */
export const myNotificationsOptions = () =>
  infiniteQueryOptions({
    queryKey: QUERY_KEYS.MY_NOTIFICATIONS,
    queryFn: ({ pageParam }) =>
      fetchMyNotifications({ pageParam: pageParam as number | null }),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => {
      if (!lastPage.cursorId) {
        return undefined;
      }

      if (lastPage.notifications.length < MY_NOTIFICATIONS_SIZE) {
        return undefined;
      }

      return lastPage.cursorId;
    },
    staleTime: NOTIFICATIONS_STALE_TIME,
  });

/**
 * 헤더 알림 드롭다운에서 사용하는 내 알림 목록 무한 스크롤 훅
 *
 * @example
 * const { data, fetchNextPage, hasNextPage } = useMyNotifications();
 */
export const useMyNotifications = (options?: { enabled?: boolean }) => {
  return useInfiniteQuery({
    ...myNotificationsOptions(),
    ...options,
    placeholderData: keepPreviousData,
  });
};
