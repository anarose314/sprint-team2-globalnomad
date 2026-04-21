/**
 * Global Nomad API와 통신하기 위한 공용 fetch 코어(core)
 *
 * - baseURL은 환경변수에서 읽어와 자동으로 붙여준다.
 * - accessToken은 호출부에서 옵션으로 주입받아 Authorization 헤더에 실는다.
 *   (클라이언트는 js-cookie, 서버는 next/headers로 각자 읽어서 전달)
 * - JSON body를 자동으로 직렬화하고, FormData는 그대로 보낸다.
 * - 응답이 실패(4xx/5xx)면 ApiError를 throw한다.
 *
 */

import { ApiError } from '@/shared/apis/apiError';

/** fetchInstance에서 추가로 받는 옵션들 */
interface FetchInstanceOptions extends Omit<RequestInit, 'body'> {
  /** JSON으로 직렬화할 요청 바디 또는 FormData */
  body?: Record<string, unknown> | FormData;
  /** URL 쿼리 스트링으로 변환할 파라미터 객체 */
  params?: Record<string, string | number | boolean | null | undefined>;
  /** 인증에 사용할 accessToken (클라/서버 래퍼에서 주입) */
  accessToken?: string | null;
}

/** 서버가 내려주는 에러 응답의 표준 형태 */
interface ApiErrorResponse {
  message: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error(
    'NEXT_PUBLIC_API_BASE_URL 환경변수가 설정되지 않았습니다. ' +
      '.env.local 파일 또는 Vercel Dashboard의 Environment Variables를 확인해주세요.'
  );
}

/**
 * 환경 중립적인 fetch 래퍼.
 * 토큰은 옵션으로 주입받아 Authorization 헤더에 실는다.
 *
 * @example
 * ```ts
 * const data = await fetchInstance<ActivitiesResponse>('/activities', {
 *   params: { method: 'offset', page: 1, size: 20 },
 *   accessToken: Cookies.get('accessToken'),
 * });
 * ```
 */
export const fetchInstance = async <T>(
  endpoint: string,
  options: FetchInstanceOptions = {}
): Promise<T> => {
  const { body, params, headers, accessToken, ...rest } = options;

  // 1) 최종 URL 만들기 (baseURL + endpoint + ?쿼리)
  //    - BASE_URL 끝의 '/'와 endpoint 앞의 '/'를 모두 제거하여 항상 단일 '/'로 이어붙임
  const base = BASE_URL.replace(/\/$/, '');
  const path = endpoint.replace(/^\//, '');
  const url = new URL(`${base}/${path}`);

  // 쿼리 파라미터 추가
  // undefined/null/'' 세 가지는 제외하되, 0이나 false 같은 의미 있는 값은 통과시킴
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // 2) 헤더 조립 - FormData일 땐 Content-Type을 직접 넣지 않음
  //    accessToken은 호출부에서 주입받은 값을 그대로 사용
  const isFormData = body instanceof FormData;
  const finalHeaders: HeadersInit = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...headers,
  };

  // 3) body 직렬화
  const finalBody = body
    ? isFormData
      ? (body as FormData)
      : JSON.stringify(body)
    : undefined;

  // 4) 실제 요청
  const response = await fetch(url.toString(), {
    ...rest,
    headers: finalHeaders,
    body: finalBody,
  });

  // 5) 응답 본문을 안전하게 파싱
  //    - 빈 본문(204, 빈 200 등)이면 undefined
  //    - 본문이 있으면 JSON 파싱
  //    - response.json()을 두 번 호출할 수 없으므로 한 번만 읽어 재사용
  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  // 6) 실패 응답 처리
  if (!response.ok) {
    const errorMessage =
      (data as Partial<ApiErrorResponse> | undefined)?.message ??
      `API Error: ${response.status}`;
    throw new ApiError(errorMessage, response.status, data);
  }

  return data as T;
};

export type { FetchInstanceOptions };

/**
 * HTTP 메서드별 편의 함수 모음
 *
 * 주의: 이 `api` 객체는 토큰을 자동으로 실어주지 않는다.
 *    실제 인증이 필요한 곳에서는 클라이언트 컴포넌트에서
 *    `fetchInstance.client.ts`의 래퍼를 사용할 것.
 *
 * @example
 * ```ts
 * const data = await api.get<PublicData>('/public-endpoint');
 * ```
 */
export const api = {
  get: <T>(endpoint: string, options?: FetchInstanceOptions) =>
    fetchInstance<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(
    endpoint: string,
    body?: FetchInstanceOptions['body'],
    options?: FetchInstanceOptions
  ) => fetchInstance<T>(endpoint, { ...options, method: 'POST', body }),

  patch: <T>(
    endpoint: string,
    body?: FetchInstanceOptions['body'],
    options?: FetchInstanceOptions
  ) => fetchInstance<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: FetchInstanceOptions) =>
    fetchInstance<T>(endpoint, { ...options, method: 'DELETE' }),
};
