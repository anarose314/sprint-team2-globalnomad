'use client';

import type { MouseEvent, ReactNode } from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/utils/cn';

interface ModalOverlayProps {
  children: ReactNode;
  onClose: () => void;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

/**
 * 공통 Modal Overlay 컴포넌트
 *
 * - 모달의 오버레이 배경과 portal 이동을 담당
 * - 오버레이 바깥 영역 클릭 시 모달 닫기 가능
 * - ESC 키 입력 시 모달 닫기 가능
 * - 모달이 열려 있는 동안 body 스크롤을 잠금
 *
 * ※ ModalBase를 감싸서 사용하며, 중첩 모달에서는 사용하지 않음
 *
 * @example
 * <ModalOverlay onClose={handleClose}>
 *   <ModalBase title="삭제하시겠어요?" onClose={handleClose}>
 *     <p>내용입니다</p>
 *   </ModalBase>
 * </ModalOverlay>
 */
export function ModalOverlay({
  children,
  onClose,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
}: ModalOverlayProps) {
  const portalRoot =
    typeof document === 'undefined'
      ? null
      : document.getElementById('modal-root');

  // 모달이 열린 동안 배경 페이지가 스크롤되지 않도록 잠그고, unmount 시 원래 값으로 복구합니다.
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // ESC 닫기를 옵션으로 제공하며, 이벤트 리스너는 unmount 시 제거합니다.
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscapeKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      onClose();
    };

    window.addEventListener('keydown', handleEscapeKeyDown);

    return () => {
      window.removeEventListener('keydown', handleEscapeKeyDown);
    };
  }, [closeOnEscape, onClose]);

  const handleOverlayMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (!closeOnOverlayClick) return;

    // 모달 내부 클릭은 무시하고, 오버레이 배경 자체를 클릭한 경우에만 닫습니다.
    if (event.target !== event.currentTarget) return;

    onClose();
  };

  if (!portalRoot) return null;

  return createPortal(
    <div
      className={cn(
        'z-modal-backdrop fixed inset-0 flex items-center justify-center bg-black/70 px-5 md:px-8',
        className
      )}
      onMouseDown={handleOverlayMouseDown}
    >
      {children}
    </div>,
    portalRoot
  );
}
