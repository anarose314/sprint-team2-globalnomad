/**
 * 공통 Modal Base 컴포넌트
 *
 * - 모달의 기본 레이아웃(오버레이 + 컨테이너)을 담당
 * - title, footer, close 버튼을 조합하여 다양한 모달 구성 가능
 * - 내부 영역 스타일은 bodyClassName, footerClassName으로 확장 가능
 *
 * ※ OneButtonModal, TwoButtonModal, ReviewModal 등에서 공통 베이스로 사용
 *
 * @example
 * <ModalBase
 *   title="삭제하시겠어요?"
 *   onClose={handleClose}
 *   showCloseButton
 *   footer={<button>확인</button>}
 * >
 *   <p>내용입니다</p>
 * </ModalBase>
 */
import type { ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

interface ModalBaseProps {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
  footerClassName?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
}

export function ModalBase({
  title,
  children,
  footer,
  className,
  bodyClassName,
  footerClassName,
  showCloseButton = false,
  onClose,
}: ModalBaseProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={cn(
          'w-full max-w-135 rounded-3xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]',
          className
        )}
      >
        {(title || showCloseButton) && (
          <div className="relative px-7 pt-7">
            {title ? (
              <h2 id="modal-title" className="text-2xl font-bold text-gray-950">
                {title}
              </h2>
            ) : null}

            {showCloseButton ? (
              <button
                type="button"
                aria-label="닫기"
                onClick={onClose}
                className="absolute top-7 right-7 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100"
              >
                <span className="text-xl leading-none">×</span>
              </button>
            ) : null}
          </div>
        )}

        <div
          className={cn(
            'px-7 py-6',
            title || showCloseButton ? 'pt-5' : 'p-7',
            bodyClassName
          )}
        >
          {children}
        </div>

        {footer ? (
          <div
            className={cn(
              'flex items-center justify-center gap-3 px-7 pb-7',
              footerClassName
            )}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
