import { useRef, useState } from 'react';

/**
 * 마우스 드래그를 통한 가로 스크롤 기능을 데스크탑에도 제공하는 커스텀 훅
 *
 * * @example
 * ```tsx
 * const { scrollRef, events } = useDragScroll<HTMLUListElement>();
 * * return (
 * <ul
 * ref={scrollRef}
 * {...events}
 * className="flex overflow-x-auto"
 * >
 * <li>아이템 1</li>
 * <li>아이템 2</li>
 * </ul>
 * );
 * ```
 */
export function useDragScroll<T extends HTMLElement>() {
  const scrollRef = useRef<T>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const onDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    if (scrollRef.current) {
      setStartX(e.pageX + scrollRef.current.scrollLeft);
    }
  };

  const onDragEnd = () => setIsDragging(false);

  const onDragMove = (e: React.MouseEvent) => {
    if (isDragging && scrollRef.current) {
      scrollRef.current.scrollLeft = startX - e.pageX;
    }
  };

  return {
    scrollRef,
    events: {
      onMouseDown: onDragStart,
      onMouseUp: onDragEnd,
      onMouseLeave: onDragEnd,
      onMouseMove: onDragMove,
    },
  };
}
