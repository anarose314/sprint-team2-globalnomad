/**
 * 브라우저 환경 (클라이언트 컴포넌트) 에서 사용하는 fetch 래퍼.
 *
 * 현재는 코어 fetchInstance 를 그대로 호출하는 얇은 래퍼.
 * 인증은 BFF (Next.js Route Handler) 의 httpOnly 쿠키로 처리되므로,
 * 클라이언트가 토큰을 직접 다루지 않는다.
 *
 * 향후 클라이언트 측 공통 처리 (요청 로깅, 에러 변환 등) 가 필요해지면
 * 이 파일에 추가한다.
 *
 * @example
 * ```ts
 * 클라이언트 컴포넌트에서
 * import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';
 *
 * BFF 호출 (인증 자동 — httpOnly 쿠키)
 * const data = await fetchInstanceClient('/api/users/me');
 * ```
 */

import {
  fetchInstance,
  type FetchInstanceOptions,
} from '@/shared/apis/fetchInstance.core';

/**
 * 클라이언트 환경에서 호출하는 fetch.
 *
 * 현재는 코어를 그대로 호출. 토큰 주입은 브라우저의 쿠키 자동 첨부에 의존.
 */
export const fetchInstanceClient = <T>(
  endpoint: string,
  options: FetchInstanceOptions = {}
): Promise<T> => {
  return fetchInstance<T>(endpoint, options);
};
