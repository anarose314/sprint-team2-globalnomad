'use client';

import type { SubmitEventHandler } from 'react';
import type { MainSearchProps } from '@/app/(main)/components/main-search/mainSearch.types';
import { IcSearch } from '@/shared/assets/icons';
import { Button } from '@/shared/components/buttons';
import { Heading } from '@/shared/components/heading';

/**
 * 메인 페이지 검색 영역 컴포넌트
 *
 * - 사용자가 입력한 검색어를 제출한다.
 * - 검색 입력값과 검색 실행 상태는 상위 컴포넌트에서 관리한다.
 *
 * @example
 * <MainSearch value={keyword} onChange={setKeyword} onSearch={handleSearch} />
 */
export function MainSearch({ value, onChange, onSearch }: MainSearchProps) {
  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    onSearch(value.trim());
  };

  return (
    <section className="flex flex-col items-center gap-8">
      <Heading
        as="h2"
        textStyle="typo-2lg-bold"
        className="md:typo-3xl-bold 2xl:typo-3xl-bold text-center text-gray-950"
      >
        무엇을 체험하고 싶으신가요?
      </Heading>

      <form
        onSubmit={handleSubmit}
        className="shadow-custom flex h-14 w-full max-w-245 items-center gap-3 rounded-3xl bg-white px-5"
      >
        <IcSearch className="h-5 w-5 shrink-0 text-gray-400" />

        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="내가 원하는 체험은"
          className="typo-lg-medium min-w-0 flex-1 bg-transparent text-gray-950 outline-none placeholder:text-gray-400"
        />

        <Button type="submit" size="sm" className="w-25 rounded-3xl">
          검색하기
        </Button>
      </form>
    </section>
  );
}
