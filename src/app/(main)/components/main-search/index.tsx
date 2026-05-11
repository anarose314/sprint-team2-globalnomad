'use client';

import { SubmitEvent } from 'react';
import { IcSearch } from '@/shared/assets/icons';
import { Button } from '@/shared/components/buttons';
import { Heading } from '@/shared/components/heading';

/**
 * 메인 페이지 검색 영역 컴포넌트
 *
 * - 사용자가 원하는 체험을 검색할 수 있는 입력 UI를 표시한다.
 * - 현재 UI 단계에서는 제출 시 기본 새로고침만 방지한다.
 *
 * @example
 * <MainSearch />
 */
export function MainSearch() {
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
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
