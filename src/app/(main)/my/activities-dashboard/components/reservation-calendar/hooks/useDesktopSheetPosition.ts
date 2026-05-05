import { RefObject, useCallback, useLayoutEffect, useState } from 'react';

const DESKTOP_FLOATING_SHEET_BREAKPOINT = 1536;
const SHEET_WIDTH = 320;
const EDGE_OFFSET = -4;
const VERTICAL_OFFSET = 6;

interface UseDesktopSheetPositionParams {
  calendarRootRef: RefObject<HTMLDivElement | null>;
  currentDate: Date;
  detailDate: Date | null;
}

export const useDesktopSheetPosition = ({
  calendarRootRef,
  currentDate,
  detailDate,
}: UseDesktopSheetPositionParams) => {
  const [desktopSheetPosition, setDesktopSheetPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const getDesktopCalendarRoot = useCallback(() => {
    if (window.innerWidth < DESKTOP_FLOATING_SHEET_BREAKPOINT) return null;
    return calendarRootRef.current;
  }, [calendarRootRef]);

  const setDesktopSheetPositionFromTile = useCallback(
    (tileElement: HTMLElement) => {
      const calendarRoot = getDesktopCalendarRoot();
      if (!calendarRoot) {
        setDesktopSheetPosition(null);
        return;
      }

      const rootRect = calendarRoot.getBoundingClientRect();
      const tileRect = tileElement.getBoundingClientRect();

      const rightAlignedLeft = tileRect.right - rootRect.left + EDGE_OFFSET;
      const rightAlignedViewportRight =
        rootRect.left + rightAlignedLeft + SHEET_WIDTH;

      const shouldOpenLeft = rightAlignedViewportRight > window.innerWidth;
      const leftAlignedLeft =
        tileRect.left - rootRect.left - SHEET_WIDTH - EDGE_OFFSET;

      const nextLeft = shouldOpenLeft
        ? Math.max(0, leftAlignedLeft)
        : rightAlignedLeft;
      const nextTop = tileRect.top - rootRect.top + VERTICAL_OFFSET;

      setDesktopSheetPosition({
        top: nextTop,
        left: nextLeft,
      });
    },
    [getDesktopCalendarRoot]
  );

  const updateDesktopSheetPosition = useCallback(() => {
    if (!detailDate) {
      setDesktopSheetPosition(null);
      return;
    }

    const calendarRoot = getDesktopCalendarRoot();
    if (!calendarRoot) {
      setDesktopSheetPosition(null);
      return;
    }

    const targetTile = calendarRoot.querySelector(
      '.reservation-calendar__day-tile--detail-target'
    ) as HTMLElement | null;

    if (!targetTile) return;
    setDesktopSheetPositionFromTile(targetTile);
  }, [detailDate, getDesktopCalendarRoot, setDesktopSheetPositionFromTile]);

  useLayoutEffect(() => {
    if (!detailDate) return;

    queueMicrotask(updateDesktopSheetPosition);

    const handleResize = () => updateDesktopSheetPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentDate, detailDate, updateDesktopSheetPosition]);

  return {
    desktopSheetPosition,
    setDesktopSheetPositionFromTile,
    clearDesktopSheetPosition: () => setDesktopSheetPosition(null),
  };
};
