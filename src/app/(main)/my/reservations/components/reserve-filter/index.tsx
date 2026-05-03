'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  FILTER_ORDER,
  SCROLL_END_THRESHOLD,
} from '@/app/(main)/my/reservations/components/reserve-filter/reserveFilter.constants';
import { FilterButton } from '@/shared/components/buttons';
import { STATUS_TEXT } from '@/shared/constants/status.constants';
import { useDragScroll } from '@/shared/hooks/useDragScroll';

export function ReserveFilter() {
  const { scrollRef, events } = useDragScroll<HTMLUListElement>();
  const [isScrollEnd, setIsScrollEnd] = useState(false);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setIsScrollEnd(
      Math.abs(scrollWidth - clientWidth - scrollLeft) < SCROLL_END_THRESHOLD
    );
  }, [scrollRef]);

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, [handleScroll]);

  return (
    <div className="relative -mx-6 mt-3.5">
      <ul
        ref={scrollRef}
        {...events}
        onScroll={handleScroll}
        className="scrollbar-hide flex gap-2 overflow-x-auto px-6"
      >
        {FILTER_ORDER.map((label) => (
          <li key={label} className="shrink-0">
            <FilterButton
              label={STATUS_TEXT[label]}
              showIcon={false}
              className="h-10"
            />
          </li>
        ))}
      </ul>
      {!isScrollEnd && (
        <div className="pointer-events-none absolute top-0 right-0 h-full w-16 bg-linear-to-l from-white to-transparent" />
      )}
    </div>
  );
}
