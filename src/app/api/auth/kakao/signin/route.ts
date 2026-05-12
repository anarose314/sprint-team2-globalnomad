/**
 * POST /api/auth/kakao/signin
 *
 * 카카오 간편 로그인 BFF 엔드포인트.
 *
 * 1. 클라이언트에서 보낸 카카오 인가 코드(token)와 redirectUri 를 받아
 * 2. 실제 백엔드(GlobalNomad API)에 카카오 로그인 요청을 보낸다.
 * 3. 백엔드가 카카오와 통신해 사용자 인증 후 토큰과 user 정보를 반환한다.
 * 4. 받은 토큰을 httpOnly 쿠키로 저장해서 응답한다.
 *
 * 회원가입과 달리 단일 호출로 인증이 완료되며, 가입된 카카오 계정이 없으면
 * 백엔드가 404를 반환한다. (호출부는 404를 회원가입 안내로 처리)
 *
 * 에러 처리:
 * - 400: 잘못된 요청 형식 (JSON 파싱 실패)
 * - 404: 가입되지 않은 카카오 계정 — 클라이언트가 회원가입 흐름으로 안내
 * - 4xx/5xx: 백엔드 API 에러를 ApiError로 받아 그대로 전달
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
  KakaoSigninBackendResponse,
  KakaoSigninRequest,
} from '@/shared/apis/auth/auth.types';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';

export const POST = async (request: NextRequest) => {
  // 요청 body 파싱 — 실패 시 400 (클라이언트 잘못)
  let body: KakaoSigninRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: '잘못된 요청 형식입니다.' },
      { status: 400 }
    );
  }

  // 카카오 로그인 요청 — 백엔드가 카카오와 통신해 인증을 한 번에 처리
  let kakaoData: KakaoSigninBackendResponse;
  try {
    kakaoData = await fetchInstanceServer<KakaoSigninBackendResponse>(
      '/oauth/sign-in/kakao',
      { method: 'POST', body }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      // 404 포함, 백엔드 에러 그대로 전달
      // (404 = 가입되지 않은 카카오 계정, 클라이언트가 회원가입 안내로 처리)
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { message: '카카오 로그인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }

  // 응답 — 바디는 user 정보, 토큰은 httpOnly 쿠키로
  const response = NextResponse.json({ user: kakaoData.user }, { status: 200 });

  response.cookies.set(
    ACCESS_TOKEN_COOKIE_NAME,
    kakaoData.accessToken,
    ACCESS_TOKEN_COOKIE_OPTIONS
  );

  response.cookies.set(
    REFRESH_TOKEN_COOKIE_NAME,
    kakaoData.refreshToken,
    REFRESH_TOKEN_COOKIE_OPTIONS
  );

  return response;
};
