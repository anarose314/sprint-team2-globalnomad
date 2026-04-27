import { IcClose } from '@/shared/assets/icons';
import { Heading } from '@/shared/components/heading';
import { cn } from '@/shared/utils/cn';

interface NotificationItem {
  id: number | string;
  title: string;
  timeText: string;
  activityTitle: string;
  scheduleText: string;
  resultPrefix?: string;
  resultAccent: string;
  resultSuffix?: string;
  accentColor?: 'primary' | 'red';
  highlighted?: boolean;
}

interface NotificationModalProps {
  title?: string;
  count?: number;
  notifications?: NotificationItem[];
  onClose?: () => void;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: '예약 승인',
    timeText: '1분 전',
    activityTitle: '함께하면 즐거운 스트릿 댄스',
    scheduleText: '(2023-01-14 15:00~18:00)',
    resultPrefix: '예약이 ',
    resultAccent: '승인',
    resultSuffix: '되었어요.',
    accentColor: 'primary',
    highlighted: true,
  },
  {
    id: 2,
    title: '예약 거절',
    timeText: '7분 전',
    activityTitle: '함께하면 즐거운 스트릿 댄스',
    scheduleText: '(2023-01-14 15:00~18:00)',
    resultPrefix: '예약이 ',
    resultAccent: '거절',
    resultSuffix: '되었어요.',
    accentColor: 'red',
  },
];

export function NotificationModal({
  title = '알림',
  count = 6,
  notifications = DEFAULT_NOTIFICATIONS,
  onClose,
}: NotificationModalProps) {
  return (
    <div className="w-57.75 overflow-hidden rounded-xl border border-gray-100 bg-white">
      {/* 헤더 */}
      <div className="flex h-12 items-center justify-between border-b border-gray-100 px-4">
        <Heading textStyle="typo-lg-bold">
          {title} {count}개
        </Heading>

        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center text-gray-950"
        >
          <IcClose aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      {/* 리스트 */}
      <ul>
        {notifications.map((notification, index) => {
          const {
            id,
            title,
            timeText,
            activityTitle,
            scheduleText,
            resultPrefix = '',
            resultAccent,
            resultSuffix = '',
            accentColor = 'primary',
            highlighted = false,
          } = notification;

          return (
            <li
              key={id}
              className={cn(
                'px-4 py-5',
                index !== notifications.length - 1 &&
                  'border-b border-gray-100',
                highlighted ? 'bg-primary-50' : 'bg-white'
              )}
            >
              <div className="flex items-start justify-between">
                <p className="typo-md-bold leading-none text-gray-950">
                  {title}
                </p>

                <span className="typo-xs-medium leading-none text-gray-400">
                  {timeText}
                </span>
              </div>

              <div className="mt-5 flex flex-col gap-3">
                <p className="typo-md-semibold leading-none text-gray-800">
                  {activityTitle}
                </p>

                <p className="typo-md-medium leading-none text-gray-800">
                  {scheduleText}
                </p>

                <p className="typo-md-medium leading-none text-gray-800">
                  {resultPrefix}
                  <span
                    className={
                      accentColor === 'red'
                        ? 'text-red-500'
                        : 'text-primary-500'
                    }
                  >
                    {resultAccent}
                  </span>
                  {resultSuffix}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
