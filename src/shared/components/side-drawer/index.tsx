'use client';

import type { MouseEvent } from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IcClose } from '@/shared/assets/icons';
import type { SideDrawerProps } from '@/shared/components/side-drawer/sideDrawer.types';
import { cn } from '@/shared/utils/cn';

/**
 * 공통 사이드 드로어 컴포넌트
 *
 * - 화면 오른쪽에서 열리는 드로어 UI를 제공한다.
 * - overlay 클릭, 닫기 버튼, ESC 키로 닫을 수 있다.
 * - 드로어가 열려 있는 동안 body 스크롤을 잠근다.
 * - 내부 콘텐츠는 children으로 주입받아 도메인과 분리한다.
 *
 * @example
 * <SideDrawer onClose={handleClose}>
 *   <Sidebar variant="drawer" />
 * </SideDrawer>
 */
export function SideDrawer({
  id,
  children,
  onClose,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  ariaLabel = '사이드 메뉴',
  overlayClassName,
  panelClassName,
}: SideDrawerProps) {
  const portalRoot =
    typeof document === 'undefined'
      ? null
      : (document.getElementById('modal-root') ?? document.body);

  useEffect(() => {
    document.body.classList.add('overflow-hidden');

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

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
    if (event.target !== event.currentTarget) return;

    onClose();
  };

  if (!portalRoot) return null;

  return createPortal(
    <div
      className={cn(
        'z-modal-backdrop fixed inset-0 flex justify-end bg-black/30',
        overlayClassName
      )}
      onMouseDown={handleOverlayMouseDown}
    >
      <div
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cn(
          'z-modal relative h-dvh w-75 max-w-full overflow-y-auto bg-white',
          panelClassName
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="사이드 메뉴 닫기"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center text-gray-600"
        >
          <IcClose className="h-6 w-6" aria-hidden="true" />
        </button>

        {children}
      </div>
    </div>,
    portalRoot
  );
}
