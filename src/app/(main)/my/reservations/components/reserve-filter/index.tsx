'use client';

import { useCallback, useEffect, useState } from 'react';
import { FilterButton } from '@/shared/components/buttons';
import { STATUS_TEXT } from '@/shared/constants/status.constants';
import { useDragScroll } from '@/shared/hooks/useDragScroll';

const FILTER_ORDER = [
  STATUS_TEXT.approved,
  STATUS_TEXT.cancelled,
  STATUS_TEXT.completed,
  STATUS_TEXT.rejected,
  STATUS_TEXT.attended,
];

export function ReserveFilter() {
  const { scrollRef, events } = useDragScroll<HTMLUListElement>();
  const [isScrollEnd, setIsScrollEnd] = useState(false);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setIsScrollEnd(Math.abs(scrollWidth - clientWidth - scrollLeft) < 20);
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
        className="scrollbar-hide flex gap-2 overflow-x-auto px-6 [&>li]:shrink-0"
      >
        {FILTER_ORDER.map((label) => (
          <li key={label}>
            <FilterButton label={label} showIcon={false} className="h-10" />
          </li>
        ))}
      </ul>
      {!isScrollEnd && (
        <div className="pointer-events-none absolute top-0 right-0 h-full w-16 bg-linear-to-l from-white to-transparent" />
      )}
    </div>
  );
}
