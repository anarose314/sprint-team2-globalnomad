<<<<<<< HEAD
import { KebabDropdown } from '@/app/(main)/activity/[id]/components/activity-info-header/kebab-dropdown';
import { IcMap, IcStar } from '@/shared/assets/icons';
=======
'use client';

import { useEffect, useRef, useState } from 'react';
import { IcMap, IcMore, IcStar } from '@/shared/assets/icons';
>>>>>>> 279d6d9 (✨ Feat: 체험 상세페이지 상단 이미지 갤러리 및 우측 타이틀 마크업)
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

<<<<<<< HEAD
=======
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
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-gray-950 transition-colors hover:bg-gray-50"
        aria-label="더보기"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <IcMore aria-hidden="true" className="size-7 shrink-0 text-gray-950" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute top-full right-0 z-50 mt-1 h-[73px] w-[63px] overflow-hidden rounded-lg border border-gray-100 bg-white md:h-[108px] md:w-24"
        >
          <div className="grid h-full grid-rows-2 divide-y divide-gray-100">
            <button
              type="button"
              role="menuitem"
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
              role="menuitem"
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

>>>>>>> 279d6d9 (✨ Feat: 체험 상세페이지 상단 이미지 갤러리 및 우측 타이틀 마크업)
/**
 * 체험 상세 페이지 상단 타이틀 영역
 *
 * 반응형 타이포그래피
 * - 카테고리 : 모바일 pretendard-13m gray-700 / PC·TB pretendard-14m gray-700
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
  const formattedRating = Number.isFinite(rating) ? rating.toFixed(1) : '-';

  return (
    <div className={cn('flex flex-col', className)}>
      {/* 카테고리 + 케밥 */}
      <div className="flex items-center justify-between">
<<<<<<< HEAD
        <span className="typo-sm-medium md:typo-md-medium tracking-tight text-gray-700">
=======
        <span className="typo-sm-medium md:typo-md-medium tracking-[-0.025em] text-gray-700">
>>>>>>> 279d6d9 (✨ Feat: 체험 상세페이지 상단 이미지 갤러리 및 우측 타이틀 마크업)
          {category}
        </span>
        {isOwner && <KebabDropdown onEdit={onEdit} onDelete={onDelete} />}
      </div>

      {/* 제목 */}
<<<<<<< HEAD
      <h2 className="typo-2lg-bold md:typo-2xl-bold mt-1 tracking-tight text-gray-950">
        {title}
      </h2>
=======
      <h1 className="typo-2lg-bold md:typo-2xl-bold mt-1 tracking-[-0.025em] text-gray-950">
        {title}
      </h1>
>>>>>>> 279d6d9 (✨ Feat: 체험 상세페이지 상단 이미지 갤러리 및 우측 타이틀 마크업)

      {/* 별점 */}
      <div className="mt-1 flex items-center gap-1">
        <IcStar
          aria-hidden="true"
          className="size-4 shrink-0 text-yellow-500"
        />
<<<<<<< HEAD
        <span className="typo-md-medium tracking-tight text-gray-700">
          {formattedRating}
        </span>
        <span className="typo-md-medium tracking-tight text-gray-700">
=======
        <span className="typo-md-medium tracking-[-0.025em] text-gray-700">
          {rating}
        </span>
        <span className="typo-md-medium tracking-[-0.025em] text-gray-700">
>>>>>>> 279d6d9 (✨ Feat: 체험 상세페이지 상단 이미지 갤러리 및 우측 타이틀 마크업)
          ({reviewCount})
        </span>
      </div>

      {/* 위치 */}
      <div className="mt-0.5 flex items-center gap-1">
        <IcMap aria-hidden="true" className="size-4 shrink-0 text-black" />
<<<<<<< HEAD
        <span className="typo-md-medium tracking-tight text-gray-700">
=======
        <span className="typo-md-medium tracking-[-0.025em] text-gray-700">
>>>>>>> 279d6d9 (✨ Feat: 체험 상세페이지 상단 이미지 갤러리 및 우측 타이틀 마크업)
          {address}
        </span>
      </div>
    </div>
  );
}
