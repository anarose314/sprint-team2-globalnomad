'use client';

import { useCallback } from 'react';

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
 * - 현재 window.location.search를 기준으로 query string을 갱신한다.
 * - 검색 실행처럼 뒤로가기가 필요한 동작은 history push로 처리한다.
 * - 필터, 정렬, 페이지네이션처럼 현재 상태만 바꾸는 동작은 history replace로 처리한다.
 * - 같은 URL로 갱신되는 경우 불필요한 history entry를 추가하지 않는다.
 *
 * @example
 * const updateSearchParams = useUpdateSearchParams();
 *
 * updateSearchParams((params) => {
 *   params.set('page', '2');
 * });
 */
export const useUpdateSearchParams = () => {
  const updateSearchParams = useCallback(
    (
      updateParams: (params: URLSearchParams) => void,
      options: UpdateSearchParamsOptions = {}
    ) => {
      if (typeof window === 'undefined') {
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const history = options.history ?? 'replace';
      const currentUrl = `${window.location.pathname}${window.location.search}`;

      updateParams(params);

      const nextUrl = createQueryString(window.location.pathname, params);

      if (nextUrl === currentUrl) {
        return;
      }

      if (history === 'push') {
        window.history.pushState(null, '', nextUrl);
        return;
      }

      window.history.replaceState(null, '', nextUrl);
    },
    []
  );

  return updateSearchParams;
};
