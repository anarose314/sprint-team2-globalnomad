// fetchInstance.client.ts
import {
  fetchInstance,
  type FetchInstanceOptions,
} from '@/shared/apis/fetchInstance.core';

/**
 * 클라이언트 환경에서 호출하는 fetch.
 *
 * `/api/` 로 시작하는 endpoint 는 BFF (same-origin) 호출로 자동 인식하여 BASE_URL prepend 를 건너뛴다.
 */
export const fetchInstanceClient = <T>(
  endpoint: string,
  options: FetchInstanceOptions = {}
): Promise<T> => {
  const isBffCall = endpoint.startsWith('/api/');

  return fetchInstance<T>(endpoint, {
    ...options,
    absoluteUrl: options.absoluteUrl ?? isBffCall,
  });
};
