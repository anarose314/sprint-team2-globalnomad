import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_TOKEN_COOKIE_NAME } from '@/shared/apis/auth/auth.constants';

/**
 * 인증이 필요한 경로 진입 시 accessToken 쿠키 존재 여부를 확인한다.
 *
 * 쿠키가 없으면 로그인 페이지로 redirect한다.
 *
 * 토큰이 만료되었더라도 쿠키 자체는 존재하므로 통과시킨다.
 * 실제 만료 처리는 fetchInstance.client의 401 retry 로직이 담당한다.
 * (refresh token으로 자동 갱신 후 재시도)
 *
 * fetchInstance.client.ts - 토큰 자동 갱신 로직
 */
export const middleware = (request: NextRequest) => {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME);

  if (!accessToken) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
};

/**
 * 미들웨어를 적용할 경로 패턴.
 *
 * `/my` 및 그 하위 모든 경로를 보호한다.
 * 추후 인증 필요한 다른 경로가 추가되면 matcher에 패턴 추가.
 */
export const config = {
  matcher: ['/my/:path*'],
};
