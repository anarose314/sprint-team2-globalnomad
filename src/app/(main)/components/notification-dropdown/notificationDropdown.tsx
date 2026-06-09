'use client';

import { useEffect, useRef } from 'react';
import type { NotificationDropdownProps } from '@/app/(main)/components/notification-dropdown/notificationDropdown.types';
import { IcClose } from '@/shared/assets/icons';
import { Heading } from '@/shared/components/heading';
import { cn } from '@/shared/utils/cn';

type NotificationStatus = 'approved' | 'declined' | 'default';

const getNotificationStatus = (content: string): NotificationStatus => {
  if (content.includes('승인')) return 'approved';
  if (content.includes('거절')) return 'declined';

  return 'default';
};

const getHighlightWord = (status: NotificationStatus) => {
  if (status === 'approved') return '승인';
  if (status === 'declined') return '거절';

  return '';
};

const formatNotificationTime = (createdAt: string) => {
  const createdTime = new Date(createdAt).getTime();
  const currentTime = Date.now();
  const diffMinutes = Math.floor((currentTime - createdTime) / 1000 / 60);

  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}일 전`;
};

const formatNotificationContentLines = (content: string) => {
  if (!content) return [];

  return content
    .replace(/\)\s*(예약이\s+(승인|거절)되었습니다\.?)/, ')\n$1')
    .split('\n');
};

const renderNotificationContent = (
  content: string,
  status: NotificationStatus
) => {
  const highlightWord = getHighlightWord(status);

  if (!highlightWord || !content.includes(highlightWord)) {
    return content;
  }

  const [firstText, ...restTexts] = content.split(highlightWord);

  return (
    <>
      {firstText}
      <span
        className={cn(
          status === 'approved' && 'text-primary-500',
          status === 'declined' && 'text-red-500'
        )}
      >
        {highlightWord}
      </span>
      {restTexts.join(highlightWord)}
    </>
  );
};

/**
 * 알림 목록을 표시하는 드롭다운 컴포넌트
 *
 * - PC에서는 헤더 알림 아이콘 아래 드롭다운 형태로 표시한다.
 * - 모바일에서는 헤더 아래 전체 폭 패널 형태로 표시한다.
 * - 알림 목록, 빈 상태, 로딩, 에러 상태를 표시한다.
 * - 하단 감지 요소가 노출되면 다음 알림 목록을 요청한다.
 *
 * @example
 * <NotificationDropdown
 *   notifications={notifications}
 *   totalCount={totalCount}
 *   onClose={handleClose}
 *   onNotificationClick={handleNotificationClick}
 *   onDeleteClick={handleDeleteClick}
 * />
 */
export function NotificationDropdown({
  id,
  notifications,
  totalCount,
  isPending = false,
  isError = false,
  hasNextPage = false,
  isFetchingNextPage = false,
  onClose,
  onLoadMore,
  onNotificationClick,
  onDeleteClick,
}: NotificationDropdownProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || !onLoadMore) {
      return;
    }

    const scrollContainer = scrollContainerRef.current;
    const loadMoreTarget = loadMoreRef.current;

    if (!scrollContainer || !loadMoreTarget) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          onLoadMore();
        }
      },
      {
        root: scrollContainer,
        rootMargin: '80px',
      }
    );

    observer.observe(loadMoreTarget);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, notifications.length, onLoadMore]);

  return (
    <section
      id={id}
      role="dialog"
      aria-label="알림 목록"
      className={cn(
        'shadow-custom z-dropdown bg-primary-50 fixed inset-x-0 top-14 bottom-0 flex flex-col px-5 py-10',
        'md:absolute md:top-14 md:right-0 md:bottom-auto md:left-auto md:h-117.25 md:w-92 md:rounded-2xl md:p-5'
      )}
    >
      <div className="mb-5 flex shrink-0 items-center justify-between">
        <Heading as="h2" textStyle="typo-2lg-bold" className="text-gray-950">
          알림 {totalCount}개
        </Heading>

        <button
          type="button"
          aria-label="알림 닫기"
          onClick={onClose}
          className="flex size-8 cursor-pointer items-center justify-center text-gray-950"
        >
          <IcClose aria-hidden="true" className="size-6" />
        </button>
      </div>

      <div
        ref={scrollContainerRef}
        className="scrollbar-hide min-h-0 flex-1 overflow-y-auto"
      >
        {isPending && (
          <p className="typo-md-medium py-10 text-center text-gray-600">
            알림을 불러오는 중입니다.
          </p>
        )}

        {isError && (
          <p className="typo-md-medium py-10 text-center text-red-500">
            알림을 불러오지 못했습니다.
          </p>
        )}

        {!isPending && !isError && notifications.length === 0 && (
          <p className="typo-md-medium py-10 text-center text-gray-600">
            새로운 알림이 없습니다.
          </p>
        )}

        {!isPending && !isError && notifications.length > 0 && (
          <ul className="flex flex-col gap-4">
            {notifications.map((notification) => {
              const status = getNotificationStatus(notification.content);

              return (
                <li key={notification.id}>
                  <div className="shadow-card relative rounded-xl bg-white transition-colors hover:bg-gray-50">
                    <button
                      type="button"
                      aria-label={`${notification.content} 알림 상세 보기`}
                      onClick={() => onNotificationClick(notification)}
                      className="block w-full cursor-pointer rounded-xl px-4 py-4 pr-12 text-left outline-none focus-visible:ring-2 focus-visible:ring-gray-950"
                    >
                      <div className="mb-3 flex items-start gap-3">
                        <span
                          aria-hidden="true"
                          className={cn(
                            'mt-1.5 size-1.5 shrink-0 rounded-full',
                            status === 'approved' && 'bg-primary-500',
                            status === 'declined' && 'bg-red-500',
                            status === 'default' && 'bg-gray-400'
                          )}
                        />
                      </div>

                      <p className="typo-md-medium leading-normal text-gray-950">
                        {formatNotificationContentLines(
                          notification.content
                        ).map((line, lineIndex) => (
                          <span
                            key={`${notification.id}-${lineIndex}`}
                            className="block"
                          >
                            {renderNotificationContent(line, status)}
                          </span>
                        ))}
                      </p>

                      <p className="typo-sm-medium mt-2 text-gray-400">
                        {formatNotificationTime(notification.createdAt)}
                      </p>
                    </button>

                    <button
                      type="button"
                      aria-label="알림 삭제"
                      onClick={() => onDeleteClick(notification.id)}
                      className="absolute top-4 right-4 flex size-7 cursor-pointer items-center justify-center rounded-md text-gray-400 transition-colors hover:text-gray-950 focus-visible:ring-2 focus-visible:ring-gray-950"
                    >
                      <IcClose aria-hidden="true" className="size-5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div ref={loadMoreRef} className="h-1" />

        {isFetchingNextPage && (
          <p className="typo-sm-medium py-4 text-center text-gray-500">
            알림을 더 불러오는 중입니다.
          </p>
        )}
      </div>
    </section>
  );
}
