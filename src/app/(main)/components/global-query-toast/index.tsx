'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { URL_QUERY_ERRORS } from '@/shared/constants/queryKeys.constants';
import { useShowToast } from '@/shared/store/useToastStore';

/**
 * 전역 URL 쿼리 에러를 감지하여 토스트 알림을 띄우는 숨김 컴포넌트
 *
 * @example
 * // URL에 ?error=unauthorized 가 포함되어 있으면 토스트를 띄우고 쿼리를 제거함
 * <GlobalQueryToast />
 */
export function GlobalQueryToast() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const showToast = useShowToast();

  const error = searchParams.get('error');

  useEffect(() => {
    if (!error) return;

    if (error === URL_QUERY_ERRORS.UNAUTHORIZED) {
      showToast({
        theme: 'warning',
        message: '본인의 체험만 수정할 수 있습니다.',
      });

      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('error');

      const newUrl = newSearchParams.toString()
        ? `${pathname}?${newSearchParams.toString()}`
        : pathname;

      router.replace(newUrl, { scroll: false });
    }
  }, [error, pathname, router, searchParams, showToast]);

  return null;
}
