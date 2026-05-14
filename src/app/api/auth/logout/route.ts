import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '@/shared/apis/auth/auth.constants';

/**
 * 로그아웃 BFF.
 *
 * 백엔드에 별도 로그아웃 엔드포인트가 없으므로,
 * 클라이언트가 가진 인증 쿠키(accessToken, refreshToken)를 만료시켜
 * 로그아웃 상태로 만든다.
 *
 * httpOnly 쿠키는 JS로 삭제할 수 없으므로 서버에서 Set-Cookie 헤더로 처리해야 한다.
 */
export const POST = async () => {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS_TOKEN_COOKIE_NAME);
  cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME);

  return new NextResponse(null, { status: 204 });
};
