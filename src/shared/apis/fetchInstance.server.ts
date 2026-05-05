/**
 * Next.js 서버 환경 (Route Handler, 서버 컴포넌트, Server Action) 에서 사용하는 fetch 래퍼.
 *
 * - next/headers 의 cookies() 로 accessToken 자동 주입
 * - 코어 fetchInstance 위에 얇게 감싼 래퍼
 *
 * @example
 * ```ts
 * Route Handler 또는 서버 컴포넌트에서
 * import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';
 *
 * const data = await fetchInstanceServer<UserResponse>('/users/me');
 * 쿠키에 accessToken 있으면 자동으로 Authorization 헤더에 실음
 * ```
 */

import { cookies } from 'next/headers';
import {
  fetchInstance,
  type FetchInstanceOptions,
} from '@/shared/apis/fetchInstance.core';

/**
 * 서버 환경에서 호출하는 fetch.
 *
 * Next.js 의 cookies() 로부터 accessToken 을 읽어 자동으로 헤더에 첨부한다.
 * 호출부에서 accessToken 옵션을 명시하면 그 값이 우선한다.
 */
export const fetchInstanceServer = async <T>(
  endpoint: string,
  options: FetchInstanceOptions = {}
): Promise<T> => {
  // 옵션에 accessToken 이 명시됐으면 그걸 우선 사용
  // (예: 로그인 직후 받은 토큰을 즉시 다른 API 호출에 사용하는 경우)
  if (options.accessToken !== undefined) {
    return fetchInstance<T>(endpoint, options);
  }

  // 명시 안 됐으면 쿠키에서 자동으로 읽음
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  return fetchInstance<T>(endpoint, {
    ...options,
    accessToken,
  });
};
