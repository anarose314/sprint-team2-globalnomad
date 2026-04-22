// src/shared/components/pagination/index.tsx
'use client';

import { IcArrowNaviLeft, IcArrowNaviRight } from '@/shared/assets/icons';
import { PaginationProps } from '@/shared/components/pagination/pagination.types';

/**
 * 페이지 번호를 표시하고 이동할 수 있는 공용 페이지네이션 컴포넌트.
 *
 * - 순수하게 UI 렌더링만 담당
 * - 현재페이지/전체페이지/변경 핸들러를 props로 주입받음
 *
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={1}
 *   totalPages={5}
 *   onPageChange={(page) => console.log(page)}
 * />
 * ```
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // 전체 페이지가 1 이하면 렌더링하지 않음
  if (totalPages <= 1) return null;

  // 페이지 배열 생성
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <nav
      className="flex items-center justify-center gap-4"
      aria-label="페이지네이션"
    >
      {/* 이전 페이지 버튼 */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirstPage}
        aria-label="이전 페이지"
        className="cursor-pointer text-gray-800 transition-colors hover:text-gray-600 disabled:cursor-not-allowed disabled:text-gray-300"
      >
        <IcArrowNaviLeft />
      </button>

      {/* 페이지 번호 목록 */}
      {pages.map((page) => {
        const isActive = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`${page} 페이지로 이동`}
            aria-current={isActive ? 'page' : undefined}
            className={`relative cursor-pointer px-2.5 transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:content-[""] ${
              isActive
                ? 'after:bg-primary-500 font-bold text-gray-950'
                : 'hover:after:bg-primary-500 text-gray-400 after:bg-transparent hover:text-gray-600'
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* 다음 페이지 버튼 */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLastPage}
        aria-label="다음 페이지"
        className="cursor-pointer text-gray-800 transition-colors hover:text-gray-600 disabled:cursor-not-allowed disabled:text-gray-300"
      >
        <IcArrowNaviRight />
      </button>
    </nav>
  );
}
