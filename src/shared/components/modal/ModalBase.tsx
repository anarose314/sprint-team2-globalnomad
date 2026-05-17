/**
 * 공통 Modal Base 컴포넌트
 *
 * - 모달의 기본 컨테이너 레이아웃을 담당
 * - title, footer, close 버튼을 조합하여 다양한 모달 구성 가능
 * - 내부 영역 스타일은 bodyClassName, footerClassName으로 확장 가능
 *
 * ※ ModalOverlay와 함께 사용하며, OneButtonModal, TwoButtonModal, ReviewModal 등에서 공통 베이스로 사용
 *
 * @example
 * <ModalOverlay onClose={handleClose}>
 *   <ModalBase title="삭제하시겠어요?" onClose={handleClose}>
 *     <p>내용입니다</p>
 *   </ModalBase>
 * </ModalOverlay>
 */

'use client';

import type { ReactNode } from 'react';
import { useId } from 'react';
import { IcClose } from '@/shared/assets/icons';
import { Heading } from '@/shared/components/heading';
import { useRequestModalClose } from '@/shared/components/modal/modal-overlay/modal-overlay-close-context';
import { cn } from '@/shared/utils/cn';

interface ModalBaseProps {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
  footerClassName?: string;
  onClose?: () => void;
  role?: 'dialog' | 'alertdialog';
}

export function ModalBase({
  title,
  children,
  footer,
  className,
  bodyClassName,
  footerClassName,
  onClose,
  role = 'dialog',
}: ModalBaseProps) {
  const titleId = useId();
  const isHeaderVisible = Boolean(title || onClose);
  const overlayClose = useRequestModalClose();

  const handleHeaderClose = () => {
    if (overlayClose) {
      overlayClose.requestClose();
      return;
    }
    onClose?.();
  };

  return (
    <div
      role={role}
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      className={cn('mx-auto w-full max-w-135 rounded-3xl bg-white', className)}
    >
      {isHeaderVisible && (
        <div className="relative px-7 pt-7">
          {title && (
            <Heading id={titleId} textStyle="typo-2xl-bold">
              {title}
            </Heading>
          )}
          {onClose && (
            <button
              type="button"
              aria-label="닫기"
              onClick={handleHeaderClose}
              className="absolute top-7 right-7 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors duration-200 ease-out hover:bg-gray-100 motion-safe:active:scale-90"
            >
              <IcClose aria-hidden="true" className="h-5 w-5" />
            </button>
          )}
        </div>
      )}

      <div
        className={cn(
          'px-7 py-6',
          isHeaderVisible ? 'pt-5' : 'p-7',
          bodyClassName
        )}
      >
        {children}
      </div>

      {footer && (
        <div
          className={cn(
            'flex items-center justify-center gap-3 px-7 pb-7',
            'motion-safe:[&_button]:animate-modal-footer-button-in',
            'motion-safe:[&_button:nth-of-type(2)]:delay-75',
            footerClassName
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
