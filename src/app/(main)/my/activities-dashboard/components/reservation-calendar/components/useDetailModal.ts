import { RefObject, useEffect } from 'react';

interface UseDetailModalParams {
  isOpen: boolean;
  onClose: () => void;
  sheetRef: RefObject<HTMLElement | null>;
}

/**
 * 상세 패널 모달 인터랙션(ESC / 외부 클릭 닫기) 처리 훅
 */
export const useDetailModal = ({
  isOpen,
  onClose,
  sheetRef,
}: UseDetailModalParams) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscClose = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscClose);
    return () => window.removeEventListener('keydown', handleEscClose);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDownOutside = (event: PointerEvent) => {
      const eventTarget = event.target as Node;
      const modalRoot = document.getElementById('modal-root');
      if (modalRoot?.contains(eventTarget)) return;

      const sheetElement = sheetRef.current;
      if (!sheetElement) return;
      if (sheetElement.contains(eventTarget)) return;
      onClose();
    };

    document.addEventListener('pointerdown', handlePointerDownOutside);
    return () =>
      document.removeEventListener('pointerdown', handlePointerDownOutside);
  }, [isOpen, onClose, sheetRef]);
};
