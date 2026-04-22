'use client';

import { useEffect } from 'react';
import { IcClose } from '@/shared/assets/icons';
import {
  DEFAULT_TITLES,
  TOAST_DURATION,
  TOAST_ICONS,
} from '@/shared/components/toast/toast.constants';
import type { ToastProps } from '@/shared/components/toast/toast.types';
import { cn } from '@/shared/utils/cn';

/**
 * 화면 하단에 띄워지는 알림(Toast) UI 컴포넌트
 */
export function Toast({
  id,
  theme = 'success',
  title,
  message,
  isDisableTitle = false,
  onClose,
}: ToastProps) {
  const { Icon, colorClass } = TOAST_ICONS[theme];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, TOAST_DURATION);

    return () => {
      clearTimeout(timer);
    };
  }, [id, onClose]);

  const handleClose = () => {
    onClose(id);
  };

  return (
    <div
      className="pointer-events-auto flex min-h-14 w-xs items-center gap-3 rounded-xl bg-white p-3 shadow-lg ring-1 ring-black/5 transition-all md:w-md"
      role="alert"
    >
      <div className={cn('shrink-0', colorClass)} aria-hidden="true">
        <Icon className="h-6 w-6" />
      </div>

      <div className="flex-1">
        {!isDisableTitle && (
          <p className="typo-sm-semibold text-black-200 -mb-0.5">
            {title || DEFAULT_TITLES[theme]}
          </p>
        )}
        {message && <p className="typo-xs-regular text-gray-400">{message}</p>}
      </div>

      <button
        type="button"
        onClick={handleClose}
        className="shrink-0 cursor-pointer rounded-md p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500"
        aria-label="닫기"
      >
        <IcClose className="h-4 w-4" />
      </button>
    </div>
  );
}
