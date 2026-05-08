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
 */

import {
  fetchInstance,
  type FetchInstanceOptions,
} from '@/shared/apis/fetchInstance.core';

/**
 * 클라이언트 환경에서 호출하는 fetch.
 *
 * `/api/` 로 시작하는 endpoint 는 BFF (same-origin) 호출로 자동 인식하여 BASE_URL prepend 를 건너뛴다.
 */
export const fetchInstanceClient = async <T>(
  endpoint: string,
  options: FetchInstanceOptions = {}
): Promise<T> => {
  if (!endpoint.startsWith('/')) {
    throw new Error(`endpoint는 '/'로 시작해야 합니다: "${endpoint}"`);
  }

  const isBffCall = endpoint.startsWith('/api/');

  return fetchInstance<T>(endpoint, {
    ...options,
    absoluteUrl: options.absoluteUrl ?? isBffCall,
  });
};
