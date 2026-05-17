'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  FILTER_BUTTON_CLASS,
  FILTER_ORDER,
  SCROLL_END_THRESHOLD,
} from '@/app/(main)/my/reservations/components/reserve-filter/reserveFilter.constants';
import { FilterButton } from '@/shared/components/buttons';
import { STATUS_TEXT } from '@/shared/constants/status.constants';
import { useDragScroll } from '@/shared/hooks/useDragScroll';

export function ReserveFilter() {
  const { scrollRef, events } = useDragScroll<HTMLUListElement>();
  const [isScrollEnd, setIsScrollEnd] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get('status');

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

  const handleFilterClick = useCallback(
    (status: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (currentStatus === status) {
        params.delete('status');
      } else {
        params.set('status', status);
      }

      router.replace(pathname + '?' + params.toString(), { scroll: false });
    },
    [currentStatus, pathname, router, searchParams]
  );

  const handleFilterReset = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('status');

    const queryString = params.toString();
    const href = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(href, { scroll: false });
  }, [pathname, router, searchParams]);

  return (
    <div className="relative -mx-6 mt-3.5">
      <ul
        ref={scrollRef}
        {...events}
        onScroll={handleScroll}
        className="scrollbar-hide flex gap-2 overflow-x-auto px-6"
      >
        <li className="shrink-0">
          <FilterButton
            label="전체"
            state={currentStatus ? 'normal' : 'active'}
            className={FILTER_BUTTON_CLASS}
            onClick={handleFilterReset}
          />
        </li>
        {FILTER_ORDER.map((label) => {
          const isSelected = currentStatus === label;

          return (
            <li key={label} className="shrink-0">
              <FilterButton
                label={STATUS_TEXT[label]}
                state={isSelected ? 'active' : 'normal'}
                className={FILTER_BUTTON_CLASS}
                onClick={() => handleFilterClick(label)}
              />
            </li>
          );
        })}
      </ul>
      {!isScrollEnd && (
        <div className="pointer-events-none absolute top-0 right-0 h-full w-16 bg-linear-to-l from-white to-transparent" />
      )}
    </div>
  );
}
