'use client';

import { useEffect, useRef, useState } from 'react';
import { IcMap, IcStar } from '@/shared/assets/icons';
import { cn } from '@/shared/utils/cn';

export interface ActivityInfoHeaderProps {
  category: string;
  title: string;
  rating: number;
  reviewCount: number;
  address: string;
  /** 내가 만든 체험이면 true → 케밥 메뉴 노출 */
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

function KebabIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="5" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="19" r="1.5" fill="currentColor" />
    </svg>
  );
}

interface KebabDropdownProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

function KebabDropdown({ onEdit, onDelete }: KebabDropdownProps) {
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
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-gray-950 transition-colors hover:bg-gray-50"
        aria-label="더보기"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <KebabIcon />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="shadow-card absolute top-full right-0 z-50 mt-1 w-40 overflow-hidden rounded-xl border border-gray-100 bg-white"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onEdit?.();
            }}
            className="typo-lg-regular hover:bg-gray-25 w-full cursor-pointer px-4 py-3 text-center text-gray-950 transition-colors"
          >
            수정하기
          </button>
          <div className="h-px bg-gray-100" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onDelete?.();
            }}
            className="typo-lg-regular hover:bg-gray-25 w-full cursor-pointer px-4 py-3 text-center text-gray-950 transition-colors"
          >
            삭제하기
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * 체험 상세 페이지 상단 타이틀 영역
 *
 * 반응형 타이포그래피
 * - 카테고리 : 모바일 pretendard-13m gray-700 / PC·TB pretendard-14m gray-950
 * - 제목     : 모바일 pretendard-18B gray-950  / PC·TB pretendard-24B gray-950
 * - 별점     : IcStar 16×16 yellow-500, 텍스트 pretendard-14m gray-700
 * - 위치     : IcMap  16×16 black,      텍스트 pretendard-14m gray-700
 *
 * `isOwner=true`이면 우측에 케밥 메뉴(수정 / 삭제) 표시
 */
export function ActivityInfoHeader({
  category,
  title,
  rating,
  reviewCount,
  address,
  isOwner = false,
  onEdit,
  onDelete,
  className,
}: ActivityInfoHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* 카테고리 + 케밥 */}
      <div className="flex items-center justify-between">
        <span className="typo-sm-medium md:typo-md-medium text-gray-700 md:text-gray-950">
          {category}
        </span>
        {isOwner && <KebabDropdown onEdit={onEdit} onDelete={onDelete} />}
      </div>

      {/* 제목 */}
      <h1 className="typo-2lg-bold md:typo-2xl-bold text-gray-950">{title}</h1>

      {/* 별점 */}
      <div className="flex items-center gap-1.5">
        <IcStar
          width={16}
          height={16}
          className="shrink-0 text-yellow-500"
          aria-hidden="true"
        />
        <span className="typo-md-medium text-gray-700">{rating}</span>
        <span className="typo-md-medium text-gray-700">({reviewCount})</span>
      </div>

      {/* 위치 */}
      <div className="flex items-center gap-1">
        <IcMap
          width={16}
          height={16}
          className="shrink-0 text-black"
          aria-hidden="true"
        />
        <span className="typo-md-medium text-gray-700">{address}</span>
      </div>
    </div>
  );
}
