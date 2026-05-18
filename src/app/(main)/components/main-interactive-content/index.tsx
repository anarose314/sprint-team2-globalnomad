'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AllActivitySection } from '@/app/(main)/components/all-activity-section';
import { MainSearch } from '@/app/(main)/components/main-search';
import { PopularActivitySection } from '@/app/(main)/components/popular-activity-section';
import { useUpdateSearchParams } from '@/app/(main)/hooks/useUpdateSearchParams';

/**
 * 메인 페이지 상호작용 영역 컴포넌트
 *
 * - 검색 입력값과 실제 검색어 상태를 관리한다.
 * - 검색 실행 시 모든 체험 목록의 필터 상태를 초기화한다.
 * - 인기 체험은 검색/필터/정렬과 독립적으로 조회한다.
 * - 검색어와 체험 목록 상태를 URL query string과 동기화한다.
 *
 * @example
 * <MainInteractiveContent />
 */
export function MainInteractiveContent() {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();

  const keyword = searchParams.get('keyword') ?? '';
  const isSearchMode = keyword.trim().length > 0;

  const [searchInputValue, setSearchInputValue] = useState(keyword);

  useEffect(() => {
    setSearchInputValue(keyword);
  }, [keyword]);

  const handleSearch = (nextKeyword: string) => {
    const trimmedKeyword = nextKeyword.trim();

    updateSearchParams((params) => {
      if (trimmedKeyword) {
        params.set('keyword', trimmedKeyword);
      } else {
        params.delete('keyword');
      }

      params.delete('category');
      params.delete('sort');
      params.delete('page');
    });
  };

  const handleResetSearchInput = () => {
    setSearchInputValue('');
  };

  return (
    <>
      <MainSearch
        value={searchInputValue}
        onChange={setSearchInputValue}
        onSearch={handleSearch}
      />

      {!isSearchMode && <PopularActivitySection />}

      <AllActivitySection
        keyword={keyword}
        isSearchMode={isSearchMode}
        onResetSearchInput={handleResetSearchInput}
      />
    </>
  );
}
