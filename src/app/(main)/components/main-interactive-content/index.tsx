'use client';

import { useState } from 'react';
import { AllActivitySection } from '@/app/(main)/components/all-activity-section';
import { MainSearch } from '@/app/(main)/components/main-search';
import { PopularActivitySection } from '@/app/(main)/components/popular-activity-section';
import { POPULAR_ACTIVITIES } from '@/app/(main)/main.constants';

/**
 * 메인 페이지 상호작용 영역 컴포넌트
 *
 * - 검색 입력값과 실제 검색어 상태를 관리한다.
 * - 검색 실행 시 모든 체험 목록의 필터 상태를 초기화한다.
 *
 * @example
 * <MainInteractiveContent />
 */
export function MainInteractiveContent() {
  const [searchInputValue, setSearchInputValue] = useState('');
  const [keyword, setKeyword] = useState('');
  const [searchVersion, setSearchVersion] = useState(0);

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

      <PopularActivitySection activities={POPULAR_ACTIVITIES} />

      <AllActivitySection
        key={searchVersion}
        keyword={keyword}
        onResetSearchInput={handleResetSearchInput}
      />
    </>
  );
}
