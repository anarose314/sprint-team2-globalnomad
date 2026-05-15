import { RefObject, useCallback, useLayoutEffect, useState } from 'react';

const DESKTOP_FLOATING_SHEET_BREAKPOINT = 1536;
const SHEET_WIDTH = 320;
const SHEET_FALLBACK_HEIGHT = 320;
const EDGE_OFFSET = -4;
const VERTICAL_OFFSET = 6;
const FOOTER_SAFE_GAP = 8;

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

      const renderedSheet = calendarRoot.querySelector(
        '.reservation-detail-sheet'
      ) as HTMLElement | null;
      const sheetHeight = renderedSheet?.offsetHeight ?? SHEET_FALLBACK_HEIGHT;

      const belowTop = tileRect.top - rootRect.top + VERTICAL_OFFSET;
      const aboveTop =
        tileRect.bottom - rootRect.top - sheetHeight - VERTICAL_OFFSET;

      const footerElement = document.querySelector(
        '[data-main-footer]'
      ) as HTMLElement | null;
      const footerTop = footerElement?.getBoundingClientRect().top;
      const sheetBottomOnBelow = rootRect.top + belowTop + sheetHeight;
      const wouldOverflowFooter =
        typeof footerTop === 'number'
          ? sheetBottomOnBelow > footerTop - FOOTER_SAFE_GAP
          : false;

      const nextTop = wouldOverflowFooter ? Math.max(0, aboveTop) : belowTop;

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
      '.reservation-status-calendar__day-tile--detail-target'
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
