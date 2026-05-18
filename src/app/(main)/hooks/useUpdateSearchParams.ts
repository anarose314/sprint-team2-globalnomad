'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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
 * - query string 갱신 시 스크롤 위치를 유지한다.
 *
 * @example
 * const updateSearchParams = useUpdateSearchParams();
 *
 * updateSearchParams((params) => {
 *   params.set('page', '2');
 * });
 */
export const useUpdateSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsRef = useRef(searchParams);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const updateSearchParams = useCallback(
    (updateParams: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParamsRef.current.toString());

      updateParams(params);

      router.replace(createQueryString(pathname, params), { scroll: false });
    },
    [pathname, router]
  );

  return updateSearchParams;
};
