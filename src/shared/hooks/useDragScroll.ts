import { useRef, useState } from 'react';

const DRAG_THRESHOLD = 5;

/**
 * 마우스 드래그를 통한 가로 스크롤 기능을 데스크탑에도 제공하는 커스텀 훅
 * 드래그 중 실수로 내부 아이템이 클릭되는 오류 방지 포함
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
export const useDragScroll = <T extends HTMLElement>() => {
  const scrollRef = useRef<T>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [clickStartX, setClickStartX] = useState(0);
  const [isClickPrevented, setIsClickPrevented] = useState(false);

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);

    if (scrollRef.current) {
      setStartX(e.pageX + scrollRef.current.scrollLeft);
      setClickStartX(e.pageX);
      setIsClickPrevented(false);
    }
  };

  const handleDragEnd = () => setIsDragging(false);

  const handleDragMove = (e: React.MouseEvent) => {
    if (isDragging && scrollRef.current) {
      if (Math.abs(e.pageX - clickStartX) > DRAG_THRESHOLD) {
        setIsClickPrevented(true);
      }
      scrollRef.current.scrollLeft = startX - e.pageX;
    }
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (isClickPrevented) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return {
    scrollRef,
    events: {
      onMouseDown: handleDragStart,
      onMouseUp: handleDragEnd,
      onMouseLeave: handleDragEnd,
      onMouseMove: handleDragMove,
      onClickCapture: handleClickCapture,
    },
  };
};
