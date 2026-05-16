import type { RefObject } from 'react';
import { useEffect } from 'react';

/**
 * 지정된 요소 외부 클릭 이벤트를 감지하는 훅
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * useClickOutside(ref, () => setIsOpen(false));
 */
export const useClickOutside = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: PointerEvent) => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('pointerdown', handleClickOutside);

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [ref, handler]);
};
