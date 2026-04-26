'use client';

import { useEffect, useRef, useState } from 'react';
import { IcMore } from '@/shared/assets/icons';

interface KebabDropdownProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function KebabDropdown({
  onEdit,
  onDelete,
}: KebabDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-gray-950 transition-colors hover:bg-gray-50"
        aria-label="더보기"
        aria-expanded={isOpen}
      >
        <IcMore aria-hidden="true" className="size-7 shrink-0 text-gray-950" />
      </button>

      {isOpen && (
        <div className="z-dropdown absolute top-full right-0 mt-1 h-20 w-16 overflow-hidden rounded-lg border border-gray-100 bg-white md:h-28 md:w-24">
          <div className="grid h-full grid-rows-2 divide-y divide-gray-100">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onEdit?.();
              }}
              className="typo-md-medium hover:bg-gray-25 md:typo-lg-medium flex h-full w-full cursor-pointer items-center justify-center text-center text-gray-950 transition-colors"
            >
              수정하기
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onDelete?.();
              }}
              className="typo-md-medium hover:bg-gray-25 md:typo-lg-medium flex h-full w-full cursor-pointer items-center justify-center text-center text-gray-950 transition-colors"
            >
              삭제하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
