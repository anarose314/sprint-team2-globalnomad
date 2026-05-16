/**
 * 브라우저 환경 (클라이언트 컴포넌트) 에서 사용하는 fetch 래퍼.
 *
 * 코어 fetchInstance 위에 다음 기능을 추가한다:
 * - `/api/`로 시작하는 endpoint는 BFF (same-origin) 호출로 자동 인식
 * - 401 응답 시 자동으로 토큰 재발급 (single-flight) 후 원래 요청 재시도
 * - refresh 자체 실패 시 세션 만료 처리 (토스트 안내 + 로그인 페이지 이동),
 *   단 `skipSessionExpiredRedirect: true`이면 리다이렉트 없이 401을 그대로 throw
 *
 * 인증은 BFF의 httpOnly 쿠키로 처리되므로, 클라이언트가 토큰을 직접 다루지 않는다.
 */

import { ApiError } from '@/shared/apis/apiError';
import {
  fetchInstance,
  type FetchInstanceOptions,
} from '@/shared/apis/fetchInstance.core';
import { useToastStore } from '@/shared/store/useToastStore';

/** `fetchInstanceClient` 전용 옵션 — 코어 `fetchInstance`에는 전달되지 않는다. */
export type FetchInstanceClientOptions = FetchInstanceOptions & {
  /** true면 401 처리 중 토큰 갱신 실패·재시도 401 시 전역 로그인 리다이렉트 없이 ApiError만 throw */
  skipSessionExpiredRedirect?: boolean;
};

/** 토큰 재발급 BFF 엔드포인트 — retry 대상에서 제외 (무한 루프 방지) */
const REFRESH_ENDPOINT = '/api/auth/tokens';

/**
 * 진행 중인 토큰 갱신 Promise.
 *
 * Single-flight 패턴: 여러 요청이 동시에 401을 받아도 refresh는 단 한 번만.
 * 나머지 요청들은 이 Promise의 결과를 기다린다.
 * (refresh token rotation 환경에서 동시 갱신 시도가 깨지는 것을 방지)
 */
let refreshPromise: Promise<void> | null = null;

/**
 * 토큰 재발급 시도.
 *
 * 동시 호출 시 진행 중인 Promise를 공유한다.
 * BFF가 두 쿠키 모두 갱신하므로, 이 함수는 성공/실패만 알려주면 충분.
 *
 * @throws refresh 실패 시 (refreshToken 만료 등)
 */
const refreshTokens = (): Promise<void> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = fetch(REFRESH_ENDPOINT, { method: 'POST' })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }
    })
    .finally(() => {
      // 다음 갱신 시도 가능하도록 초기화
      refreshPromise = null;
    });

  return refreshPromise;
};

/**
 * 세션 만료 처리가 이미 실행되었는지 여부.
 *
 * 동시에 여러 요청이 401을 받고 refresh도 실패한 경우, 각 요청의 catch 블록이
 * 각각 handleSessionExpired를 호출하여 토스트/navigation이 중복 실행되는 것을 방지.
 *
 * 페이지 이동(window.location.href)으로 모듈이 재로드되면 자연스럽게 reset된다.
 */
let isSessionExpiredHandled = false;

/**
 * 세션 만료 처리 — 토스트 안내 후 로그인 페이지로 강제 이동.
 *
 * window.location.href를 사용하여 풀 페이지 리로드를 강제한다.
 * SPA navigation(router.push)은 클라이언트 상태가 남아있을 수 있어 부적합.
 *
 * 동시 호출되어도 한 번만 실행된다(guard).
 */
const handleSessionExpired = () => {
  if (isSessionExpiredHandled) return;
  isSessionExpiredHandled = true;

  useToastStore.getState().actions.showToast({
    theme: 'warning',
    message: '세션이 만료되었습니다. 다시 로그인해 주세요.',
  });
  window.location.href = '/login';
};

/**
 * 클라이언트 환경에서 호출하는 fetch.
 *
 * `/api/` 로 시작하는 endpoint 는 BFF (same-origin) 호출로 자동 인식하여
 * BASE_URL prepend 를 건너뛴다.
 *
 * 401 응답 시 자동으로 토큰 갱신을 시도하고, 성공하면 원래 요청을 재시도한다.
 * 갱신 자체가 실패하면(401 응답) 세션 만료로 간주하여 로그인 페이지로 이동시킨다.
 * `skipSessionExpiredRedirect`가 true면 이동하지 않고 ApiError만 전파한다.
 */
export const fetchInstanceClient = async <T>(
  endpoint: string,
  options: FetchInstanceClientOptions = {}
): Promise<T> => {
  if (!endpoint.startsWith('/')) {
    throw new Error(`endpoint는 '/'로 시작해야 합니다: "${endpoint}"`);
  }

  const isBffCall = endpoint.startsWith('/api/');
  const { skipSessionExpiredRedirect, ...restOptions } = options;
  const requestOptions: FetchInstanceOptions = {
    ...restOptions,
    absoluteUrl: options.absoluteUrl ?? isBffCall,
  };

  try {
    return await fetchInstance<T>(endpoint, requestOptions);
  } catch (error) {
    // 401 이외 에러, 또는 refresh 엔드포인트 자체의 에러는 그대로 전파
    const shouldRetry =
      error instanceof ApiError &&
      error.status === 401 &&
      endpoint !== REFRESH_ENDPOINT;

    if (!shouldRetry) {
      throw error;
    }

    // 토큰 갱신 시도 (single-flight)
    try {
      await refreshTokens();
    } catch {
      // refresh 실패 — 세션 만료 처리(호출부에서 401 UI 처리하는 경우는 제외)
      if (!skipSessionExpiredRedirect) {
        handleSessionExpired();
      }
      throw error;
    }

    // 갱신 성공 — 원래 요청을 한 번만 재시도
    // 재시도도 401이면 세션이 회복 불가능한 상태로 간주 → 세션 만료 처리
    try {
      return await fetchInstance<T>(endpoint, requestOptions);
    } catch (retryError) {
      if (
        retryError instanceof ApiError &&
        retryError.status === 401 &&
        !skipSessionExpiredRedirect
      ) {
        handleSessionExpired();
      }
      throw retryError;
    }
  }
};
