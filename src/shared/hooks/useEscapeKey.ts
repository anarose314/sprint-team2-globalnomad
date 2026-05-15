import { useEffect } from 'react';

/**
 * Escape 키 입력을 감지하여 이벤트를 실행하는 훅
 *
 * @example
 * useEscapeKey(() => setIsOpen(false), isOpen);
 */
export const useEscapeKey = (
  handler: (event: KeyboardEvent) => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handler(event);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [handler, enabled]);
};
