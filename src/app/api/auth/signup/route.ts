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
 *
 * 에러 처리:
 * - 400: 잘못된 요청 형식 (JSON 파싱 실패)
 * - 4xx/5xx: 백엔드 API 에러를 ApiError로 받아 그대로 전달
 * - 201: 회원가입 성공했으나 자동 로그인 실패 (재로그인 안내)
 * - 500: 예상치 못한 서버 에러
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
  // 요청 body 파싱 — 실패 시 400 (클라이언트 잘못)
  let body: SignupRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: '잘못된 요청 형식입니다.' },
      { status: 400 }
    );
  }

  // 회원가입 요청 — 실패 시 백엔드 에러 그대로 전달
  try {
    await fetchInstanceServer<User>('/users', { method: 'POST', body });
  } catch (error) {
    // 회원가입 실패 — 에러 그대로 전달
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { message: '회원가입 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }

  // 자동 로그인 — 회원가입은 성공한 상태이므로 별도 처리
  let loginData: LoginBackendResponse;
  try {
    loginData = await fetchInstanceServer<LoginBackendResponse>('/auth/login', {
      method: 'POST',
      body: { email: body.email, password: body.password },
    });
  } catch {
    // 회원가입은 성공했지만 자동 로그인 실패
    // → 200 으로 응답하되 user 없이, message 만 전달
    return NextResponse.json(
      {
        message:
          '회원가입은 완료되었으나 자동 로그인에 실패했습니다. 로그인 페이지에서 다시 시도해주세요.',
      },
      { status: 200 }
    );
  }

  // 응답 — 바디는 user 정보, 토큰은 httpOnly 쿠키로
  const response = NextResponse.json({ user: loginData.user }, { status: 200 });

  response.cookies.set(
    ACCESS_TOKEN_COOKIE_NAME,
    loginData.accessToken,
    ACCESS_TOKEN_COOKIE_OPTIONS
  );

  response.cookies.set(
    REFRESH_TOKEN_COOKIE_NAME,
    loginData.refreshToken,
    REFRESH_TOKEN_COOKIE_OPTIONS
  );

  return response;
};
