import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ApiError } from '@/shared/apis/apiError';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from '@/shared/apis/auth/auth.constants';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';

interface RefreshTokensResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * POST /api/auth/tokens
 *
 * 액세스 토큰 재발급 BFF 엔드포인트.
 *
 * 1. 쿠키에서 refreshToken을 꺼낸다.
 * 2. 백엔드 `/auth/tokens` 를 refreshToken으로 인증하여 호출한다.
 *    (백엔드 응답: { accessToken, refreshToken } — refresh token rotation)
 * 3. 받은 두 토큰을 httpOnly 쿠키로 갱신하여 응답한다.
 *
 * 클라이언트(fetchInstance.client)가 401 응답을 받았을 때 자동으로 이 엔드포인트를
 * 호출하여 토큰을 갱신하고 원래 요청을 재시도하는 흐름의 일부.
 *
 * 에러 처리:
 * - 401: refreshToken 쿠키가 없거나, 백엔드가 갱신 거부
 *        → 클라이언트는 완전 로그아웃 처리 (로그인 페이지로)
 * - 4xx/5xx: 백엔드 에러 그대로 전달
 * - 500: 예상치 못한 서버 에러
 */
export const POST = async () => {
  // 1. 쿠키에서 refreshToken 꺼내기
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { message: '리프레시 토큰이 없습니다.' },
      { status: 401 }
    );
  }

  // 2. 백엔드로 토큰 재발급 요청
  //    - 자동 accessToken 주입 막기 위해 accessToken: null
  //    - Authorization 헤더에 refreshToken 직접 주입
  let tokens: RefreshTokensResponse;
  try {
    tokens = await fetchInstanceServer<RefreshTokensResponse>('/auth/tokens', {
      method: 'POST',
      accessToken: null,
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      // 백엔드가 401 주면 그대로 401 (refreshToken 만료/무효 — 완전 로그아웃 필요)
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { message: '토큰 재발급 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }

  // 3. 두 쿠키 모두 갱신 (refresh token rotation 패턴)
  const response = NextResponse.json({ success: true }, { status: 200 });

  response.cookies.set(
    ACCESS_TOKEN_COOKIE_NAME,
    tokens.accessToken,
    ACCESS_TOKEN_COOKIE_OPTIONS
  );

  response.cookies.set(
    REFRESH_TOKEN_COOKIE_NAME,
    tokens.refreshToken,
    REFRESH_TOKEN_COOKIE_OPTIONS
  );

  return response;
};
