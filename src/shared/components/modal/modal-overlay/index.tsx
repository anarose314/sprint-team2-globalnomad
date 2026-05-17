'use client';

import type { MouseEvent, ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ModalOverlayCloseContext } from '@/shared/components/modal/modal-overlay/modal-overlay-close-context';
import { cn } from '@/shared/utils/cn';

const MODAL_EXIT_MS = 220;

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
 * - 열림/닫힘 시 배경·패널 전환 애니메이션 (`requestClose`로 닫을 때 동일)
 * - `min-h-dvh` + 세로 플렉스로 뷰포트·모바일 주소창 변화에도 패널을 화면 중앙에 맞춤
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

  const [isExiting, setIsExiting] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const clearExitTimer = useCallback(() => {
    if (exitTimerRef.current !== null) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
  }, []);

  const runOnClose = useCallback(() => {
    clearExitTimer();
    onClose();
  }, [clearExitTimer, onClose]);

  const requestClose = useCallback(() => {
    if (isExiting) return;

    if (reduceMotion) {
      runOnClose();
      return;
    }

    setIsExiting(true);
    exitTimerRef.current = setTimeout(() => {
      exitTimerRef.current = null;
      runOnClose();
    }, MODAL_EXIT_MS);
  }, [isExiting, reduceMotion, runOnClose]);

  const overlayCloseContext = useMemo(() => ({ requestClose }), [requestClose]);

  useEffect(() => {
    return () => {
      clearExitTimer();
    };
  }, [clearExitTimer]);

  // 모달이 열린 동안 배경 페이지가 스크롤되지 않도록 잠그고, unmount 시 원래 상태로 복구합니다.
  useEffect(() => {
    document.body.classList.add('overflow-hidden');

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  // ESC 닫기를 옵션으로 제공하며, 이벤트 리스너는 unmount 시 제거합니다.
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscapeKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      requestClose();
    };

    window.addEventListener('keydown', handleEscapeKeyDown);

    return () => {
      window.removeEventListener('keydown', handleEscapeKeyDown);
    };
  }, [closeOnEscape, requestClose]);

  const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (!closeOnOverlayClick) return;
    if (event.target !== event.currentTarget) return;

    requestClose();
  };

  if (!portalRoot) return null;

  const backdropAnimClass = reduceMotion
    ? undefined
    : isExiting
      ? 'motion-safe:animate-modal-backdrop-out'
      : 'motion-safe:animate-modal-backdrop-in';

  const panelAnimClass = reduceMotion
    ? undefined
    : isExiting
      ? 'motion-safe:animate-modal-content-out'
      : 'motion-safe:animate-modal-content-in';

  return createPortal(
    <ModalOverlayCloseContext.Provider value={overlayCloseContext}>
      <div
        className={cn(
          'z-modal-backdrop pointer-events-auto fixed inset-0 overflow-y-auto',
          className
        )}
      >
        <div
          data-modal-backdrop
          aria-hidden
          className={cn(
            'pointer-events-auto fixed inset-0 z-0 bg-black/70',
            backdropAnimClass
          )}
          onMouseDown={handleBackdropMouseDown}
        />

        <div className="pointer-events-none relative z-10 flex min-h-dvh w-full min-w-0 flex-col items-center justify-center px-5 py-8 md:px-8">
          <div className="box-border w-full max-w-full shrink-0">
            <div
              data-modal-content
              className={cn(
                'pointer-events-auto mx-auto box-border w-full max-w-full min-w-0 origin-center',
                panelAnimClass
              )}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </ModalOverlayCloseContext.Provider>,
    portalRoot
  );
}
