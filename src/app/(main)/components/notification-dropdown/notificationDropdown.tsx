import { IcClose } from '@/shared/assets/icons';
import { Heading } from '@/shared/components/heading';
import { cn } from '@/shared/utils/cn';

interface NotificationItem {
  id: number;
  teamId: string;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface NotificationResponse {
  cursorId: number;
  notifications: NotificationItem[];
  totalCount: number;
}

interface NotificationDropdownProps {
  data?: NotificationResponse;
  onClose?: () => void;
}

const DEFAULT_NOTIFICATION_RESPONSE: NotificationResponse = {
  cursorId: 0,
  totalCount: 2,
  notifications: [
    {
      id: 1,
      teamId: 'team-1',
      userId: 1,
      content: '예약이 승인되었어요.',
      createdAt: '2026-04-30T18:43:32.823Z',
      updatedAt: '2026-04-30T18:43:32.823Z',
      deletedAt: null,
    },
    {
      id: 2,
      teamId: 'team-1',
      userId: 1,
      content: '예약이 거절되었어요.',
      createdAt: '2026-04-30T18:36:32.823Z',
      updatedAt: '2026-04-30T18:36:32.823Z',
      deletedAt: null,
    },
  ],
};

function formatNotificationTime(createdAt: string) {
  const createdTime = new Date(createdAt).getTime();
  const currentTime = Date.now();
  const diffMinutes = Math.floor((currentTime - createdTime) / 1000 / 60);

  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}일 전`;
}

export function NotificationDropdown({
  data = DEFAULT_NOTIFICATION_RESPONSE,
  onClose,
}: NotificationDropdownProps) {
  const { notifications, totalCount } = data;

  return (
    <div className="w-57.75 overflow-hidden rounded-xl border border-gray-100 bg-white">
      <div className="flex h-12 items-center justify-between border-b border-gray-100 px-4">
        <Heading textStyle="typo-lg-bold">알림 {totalCount}개</Heading>
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center text-gray-950"
        >
          <IcClose aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      <ul>
        {notifications.map((notification, index) => {
          const isHighlighted = index === 0;

          return (
            <li
              key={notification.id}
              className={cn(
                'px-4 py-5',
                index !== notifications.length - 1 &&
                  'border-b border-gray-100',
                isHighlighted ? 'bg-primary-50' : 'bg-white'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="typo-md-medium leading-normal text-gray-800">
                  {notification.content}
                </p>

                <span className="typo-xs-medium shrink-0 leading-none text-gray-400">
                  {formatNotificationTime(notification.createdAt)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
