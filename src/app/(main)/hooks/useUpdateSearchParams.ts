'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

type UpdateSearchParamsOptions = {
  history?: 'push' | 'replace';
};

const createQueryString = (
  pathname: string,
  params: URLSearchParams
): string => {
  const queryString = params.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
};

/**
 * 메인 페이지 URL query string을 갱신하는 커스텀 훅
 *
 * - 현재 searchParams를 기준으로 query string을 갱신한다.
 * - 검색 실행처럼 뒤로가기가 필요한 동작은 history push로 처리한다.
 * - 필터, 정렬, 페이지네이션처럼 현재 상태만 바꾸는 동작은 history replace로 처리한다.
 *
 * @example
 * const updateSearchParams = useUpdateSearchParams();
 *
 * updateSearchParams((params) => {
 *   params.set('page', '2');
 * });
 */
export const useUpdateSearchParams = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsRef = useRef(searchParams);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const updateSearchParams = useCallback(
    (
      updateParams: (params: URLSearchParams) => void,
      options: UpdateSearchParamsOptions = {}
    ) => {
      const params = new URLSearchParams(searchParamsRef.current.toString());
      const history = options.history ?? 'replace';

      updateParams(params);

      const nextUrl = createQueryString(pathname, params);

      if (history === 'push') {
        window.history.pushState(null, '', nextUrl);
        return;
      }

      window.history.replaceState(null, '', nextUrl);
    },
    [pathname]
  );

  return updateSearchParams;
};
