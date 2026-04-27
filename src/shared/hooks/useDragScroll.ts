import { useCallback, useMemo, useRef } from 'react';

const DRAG_THRESHOLD = 5;

/**
 * 마우스 드래그를 통한 가로 스크롤 기능을 데스크탑에도 제공하는 커스텀 훅
 * 드래그 중 실수로 내부 아이템이 클릭되는 오류 방지 포함
 *
 * @example
 * const { scrollRef, events } = useDragScroll<HTMLUListElement>();
 * return (
 *   <ul
 *     ref={scrollRef}
 *     {...events}
 *     className="flex overflow-x-auto"
 *   >
 *     <li>아이템 1</li>
 *     <li>아이템 2</li>
 *   </ul>
 * );
 */
export const useDragScroll = <T extends HTMLElement = HTMLUListElement>() => {
  const scrollRef = useRef<T>(null);

  const dragState = useRef({
    isDragging: false,
    startX: 0,
    clickStartX: 0,
    isClickPrevented: false,
  });

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    dragState.current.isDragging = true;

    if (scrollRef.current) {
      dragState.current.startX = e.pageX + scrollRef.current.scrollLeft;
      dragState.current.clickStartX = e.pageX;
      dragState.current.isClickPrevented = false;
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    dragState.current = {
      isDragging: false,
      startX: 0,
      clickStartX: 0,
      isClickPrevented: false,
    };
  }, []);

  const handleDragMove = useCallback((e: React.MouseEvent) => {
    if (dragState.current.isDragging && scrollRef.current) {
      e.preventDefault();

      if (Math.abs(e.pageX - dragState.current.clickStartX) > DRAG_THRESHOLD) {
        dragState.current.isClickPrevented = true;
      }
      scrollRef.current.scrollLeft = dragState.current.startX - e.pageX;
    }
  }, []);

  const handleClickCapture = useCallback((e: React.MouseEvent) => {
    if (dragState.current.isClickPrevented) {
      e.stopPropagation();
      e.preventDefault();
    }
  }, []);

  const events = useMemo(
    () => ({
      onMouseDown: handleDragStart,
      onMouseUp: handleDragEnd,
      onMouseLeave: handleDragEnd,
      onMouseMove: handleDragMove,
      onClickCapture: handleClickCapture,
    }),
    [handleDragStart, handleDragEnd, handleDragMove, handleClickCapture]
  );

  return {
    scrollRef,
    events,
  };
};
