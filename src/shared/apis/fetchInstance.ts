/**
 * Global Nomad API와 통신하기 위한 공용 fetch 래퍼(wrapper)
 *
 * - baseURL은 환경변수에서 읽어와 자동으로 붙여준다.
 * - 클라이언트 사이드에서는 localStorage의 accessToken을 꺼내
 *   Authorization 헤더에 Bearer 토큰으로 실어 보낸다.
 * - JSON body를 자동으로 직렬화하고, FormData는 그대로 보낸다.
 * - 응답이 실패(4xx/5xx)면 서버 에러 메시지를 담은 Error를 throw한다.
 *
 */

import { ApiError } from '@/shared/apis/apiError';

/** fetchInstance에서 추가로 받는 옵션들 */
interface FetchInstanceOptions extends Omit<RequestInit, 'body'> {
  /** JSON으로 직렬화할 요청 바디 또는 FormData */
  body?: Record<string, unknown> | FormData;
  /** URL 쿼리 스트링으로 변환할 파라미터 객체 */
  params?: Record<string, string | number | boolean | null | undefined>;
}

/** 서버가 내려주는 에러 응답의 표준 형태 */
interface ApiErrorResponse {
  message: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

/**
 * 프로젝트 전역에서 사용하는 fetch 래퍼.
 *
 * @example
 * ```ts
 * const data = await fetchInstance<ActivitiesResponse>('/activities', {
 *   params: { method: 'offset', page: 1, size: 20 },
 * });
 * ```
 */
export const fetchInstance = async <T>(
  endpoint: string,
  options: FetchInstanceOptions = {}
): Promise<T> => {
  const { body, params, headers, ...rest } = options;

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

  // 2) 토큰은 브라우저에서만 꺼냄 (SSR 환경에서 window 없음)
  const accessToken =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  // 3) 헤더 조립 - FormData일 땐 Content-Type을 직접 넣지 않음
  const isFormData = body instanceof FormData;
  const finalHeaders: HeadersInit = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...headers,
  };

  // 4) body 직렬화
  const finalBody = body
    ? isFormData
      ? (body as FormData)
      : JSON.stringify(body)
    : undefined;

  // 5) 실제 요청
  const response = await fetch(url.toString(), {
    ...rest,
    headers: finalHeaders,
    body: finalBody,
  });

  // 6) 응답 본문을 안전하게 파싱
  //    - 빈 본문(204, 빈 200 등)이면 undefined
  //    - 본문이 있으면 JSON 파싱
  //    - response.json()을 두 번 호출할 수 없으므로 한 번만 읽어 재사용
  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  // 7) 실패 응답 처리
  if (!response.ok) {
    const errorMessage =
      (data as Partial<ApiErrorResponse> | undefined)?.message ??
      `API Error: ${response.status}`;
    throw new ApiError(errorMessage, response.status, data);
  }

  return data as T;
};

/**
 * HTTP 메서드별 편의 함수 모음
 * 실제 API 모듈에서는 이 객체를 통해 호출하는 걸 권장
 *
 * @example
 * ```ts
 * const me = await api.get<User>('/users/me');
 * await api.post('/auth/signin', { email, password });
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
