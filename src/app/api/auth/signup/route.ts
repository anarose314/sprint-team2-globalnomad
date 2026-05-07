/**
 * POST /api/auth/signup
 *
 * 회원가입 BFF 엔드포인트.
 *
 * 1. 클라이언트에서 보낸 email, nickname, password 를 받아
 * 2. 실제 백엔드(GlobalNomad API)에 회원가입 요청을 보내고
 * 3. 그 직후 같은 자격증명으로 자동 로그인을 수행하여 토큰을 받고
 * 4. 받은 토큰을 httpOnly 쿠키로 저장해서 응답한다.
 *
 * 클라이언트는 한 번의 호출로 회원가입 + 자동 로그인 완료.
 * 이후 인증 필요 요청에선 브라우저가 쿠키를 자동 첨부한다.
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/shared/apis/apiError';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from '@/shared/apis/auth/auth.constants';
import type {
  LoginBackendResponse,
  SignupRequest,
  User,
} from '@/shared/apis/auth/auth.types';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';

export const POST = async (request: NextRequest) => {
  try {
    // 클라이언트에서 보낸 바디 파싱
    const body: SignupRequest = await request.json();

    // 백엔드에 회원가입 요청 — 백엔드는 user 정보만 응답
    await fetchInstanceServer<User>('/users', {
      method: 'POST',
      body,
    });

    // 자동 로그인 — 같은 자격증명으로 토큰 받기
    const loginData = await fetchInstanceServer<LoginBackendResponse>(
      '/auth/login',
      {
        method: 'POST',
        body: { email: body.email, password: body.password },
      }
    );

    // 응답 만들기 — 바디는 user 정보만, 토큰은 httpOnly 쿠키로
    const response = NextResponse.json(
      { user: loginData.user },
      { status: 200 }
    );

    // accessToken 쿠키 설정 (httpOnly)
    response.cookies.set(
      ACCESS_TOKEN_COOKIE_NAME,
      loginData.accessToken,
      ACCESS_TOKEN_COOKIE_OPTIONS
    );

    // refreshToken 쿠키 설정 (httpOnly)
    response.cookies.set(
      REFRESH_TOKEN_COOKIE_NAME,
      loginData.refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS
    );

    return response;
  } catch (error) {
    // 백엔드가 던진 ApiError 를 클라이언트로 그대로 전달
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    // 예상치 못한 에러
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
};
