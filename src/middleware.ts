import { NextRequest, NextResponse } from 'next/server';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '@/shared/apis/auth/auth.constants';

/** 토큰 재발급 BFF 엔드포인트 */
const REFRESH_ENDPOINT = '/api/auth/tokens';

/** 인증 실패 시 redirect할 경로 */
const LOGIN_PATH = '/login';

/**
 * Set-Cookie 헤더 문자열에서 특정 쿠키 이름의 값을 추출한다.
 *
 * @example
 * parseCookieValue('accessToken=eyJ...; Path=/; HttpOnly', 'accessToken')
 * // → 'eyJ...'
 */
const parseCookieValue = (
  setCookieHeader: string,
  name: string
): string | null => {
  const match = setCookieHeader.match(new RegExp(`^${name}=([^;]+)`));
  return match ? match[1] : null;
};

/**
 * 미들웨어에서 토큰 갱신을 시도한다.
 *
 * BFF Route Handler(`/api/auth/tokens`)를 self-call하여 갱신한다.
 * BFF 응답의 Set-Cookie 헤더에서 새 토큰을 추출하여:
 * 1. `request.cookies`를 업데이트 (Server Components가 새 토큰을 보도록)
 * 2. 응답 쿠키에 박음 (브라우저가 새 토큰을 저장하도록)
 *
 * Next.js의 알려진 동작: 미들웨어가 응답에만 쿠키를 박으면 같은 요청의
 * Server Components는 그 쿠키를 볼 수 없다. 따라서 `NextResponse.next()`의
 * `request: { headers }` 옵션으로 요청 쿠키도 함께 업데이트한다.
 *
 * @param request 원본 요청
 * @returns 갱신 성공 시 NextResponse(요청/응답 쿠키 모두 업데이트), 실패 시 null
 */
const tryRefreshTokens = async (
  request: NextRequest
): Promise<NextResponse | null> => {
  try {
    const refreshUrl = new URL(REFRESH_ENDPOINT, request.url);

    const bffResponse = await fetch(refreshUrl, {
      method: 'POST',
      headers: {
        Cookie: request.headers.get('cookie') ?? '',
      },
    });

    if (!bffResponse.ok) return null;

    const setCookies = bffResponse.headers.getSetCookie();

    // BFF 응답의 Set-Cookie 헤더에서 새 토큰 값 추출
    let newAccessToken: string | null = null;
    let newRefreshToken: string | null = null;

    for (const cookie of setCookies) {
      const access = parseCookieValue(cookie, ACCESS_TOKEN_COOKIE_NAME);
      const refresh = parseCookieValue(cookie, REFRESH_TOKEN_COOKIE_NAME);
      if (access) newAccessToken = access;
      if (refresh) newRefreshToken = refresh;
    }

    if (!newAccessToken || !newRefreshToken) return null;

    // 요청 헤더의 cookie 업데이트 — Server Components의 cookies()가 새 토큰 인식하도록
    const updatedCookieHeader = [
      `${ACCESS_TOKEN_COOKIE_NAME}=${newAccessToken}`,
      `${REFRESH_TOKEN_COOKIE_NAME}=${newRefreshToken}`,
    ].join('; ');

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('cookie', updatedCookieHeader);

    // 업데이트된 요청 헤더로 NextResponse 생성
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    // 응답 쿠키도 박음 — 브라우저가 새 토큰을 받아 저장하도록
    setCookies.forEach((cookie) => {
      response.headers.append('Set-Cookie', cookie);
    });

    return response;
  } catch (error) {
    console.error('[Middleware] 토큰 갱신 중 예외 발생:', error);
    return null;
  }
};

/**
 * 인증이 필요한 경로 진입 시 토큰 검증.
 *
 * 흐름:
 * 1. accessToken 쿠키 있으면 통과 (유효성은 fetchInstance.client의 401 retry가 담당)
 * 2. accessToken 없지만 refreshToken 있으면 미들웨어에서 직접 갱신 시도
 *    - 성공: 새 토큰을 요청/응답 쿠키에 박아 통과
 *    - 실패: 로그인 페이지로 redirect
 * 3. 둘 다 없으면 로그인 페이지로 redirect
 *
 * @see fetchInstance.client.ts — API 호출 시점의 토큰 갱신 (이 미들웨어와 별개 흐름)
 */
export const middleware = async (request: NextRequest) => {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME);

  if (accessToken) {
    return NextResponse.next();
  }

  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME);
  const loginUrl = new URL(LOGIN_PATH, request.url);

  if (!refreshToken) {
    return NextResponse.redirect(loginUrl);
  }

  const refreshedResponse = await tryRefreshTokens(request);

  if (!refreshedResponse) {
    return NextResponse.redirect(loginUrl);
  }

  return refreshedResponse;
};

export const config = {
  matcher: ['/my', '/my/:path*'],
};
