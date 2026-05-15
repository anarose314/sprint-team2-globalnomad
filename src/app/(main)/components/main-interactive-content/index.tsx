'use client';

import { useState } from 'react';
import { AllActivitySection } from '@/app/(main)/components/all-activity-section';
import { MainSearch } from '@/app/(main)/components/main-search';
import { PopularActivitySection } from '@/app/(main)/components/popular-activity-section';

/**
 * 메인 페이지 상호작용 영역 컴포넌트
 *
 * - 검색 입력값과 실제 검색어 상태를 관리한다.
 * - 검색 실행 시 모든 체험 목록의 필터 상태를 초기화한다.
 * - 인기 체험은 검색/필터/정렬과 독립적으로 조회한다.
 *
 * @example
 * <MainInteractiveContent />
 */
export function MainInteractiveContent() {
  const [searchInputValue, setSearchInputValue] = useState('');
  const [keyword, setKeyword] = useState('');
  const [searchVersion, setSearchVersion] = useState(0);

  const isSearchMode = keyword.trim().length > 0;

  const handleSearch = (nextKeyword: string) => {
    setKeyword(nextKeyword);
    setSearchVersion((prev) => prev + 1);
  };

  const handleResetSearchInput = () => {
    setSearchInputValue('');
    setKeyword('');
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
        key={searchVersion}
        keyword={keyword}
        isSearchMode={isSearchMode}
        onResetSearchInput={handleResetSearchInput}
      />
    </>
  );
}
