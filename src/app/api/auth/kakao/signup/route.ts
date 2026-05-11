/**
 * POST /api/oauth/kakao/signup
 *
 * 카카오 간편 회원가입 BFF 엔드포인트.
 *
 * 1. 클라이언트에서 보낸 카카오 인가 코드(token), redirectUri, nickname 을 받아
 * 2. 실제 백엔드(GlobalNomad API)에 카카오 회원가입 요청을 보낸다.
 * 3. 백엔드가 카카오와 통신해 사용자 인증 후 토큰과 user 정보를 반환한다.
 * 4. 받은 토큰을 httpOnly 쿠키로 저장해서 응답한다.
 *
 * 일반 회원가입과 달리 백엔드 단일 호출로 회원가입+로그인이 완료되므로
 * 부분 실패 시나리오(자동 로그인 실패)가 존재하지 않는다.
 *
 * 에러 처리:
 * - 400: 잘못된 요청 형식 (JSON 파싱 실패)
 * - 4xx/5xx: 백엔드 API 에러를 ApiError로 받아 그대로 전달
 *           (인가 코드 만료/재사용, 닉네임 중복 등)
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
  KakaoSignupBackendResponse,
  KakaoSignupRequest,
} from '@/shared/apis/auth/auth.types';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';

export const POST = async (request: NextRequest) => {
  // 요청 body 파싱 — 실패 시 400 (클라이언트 잘못)
  let body: KakaoSignupRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: '잘못된 요청 형식입니다.' },
      { status: 400 }
    );
  }

  // 카카오 회원가입 요청 — 백엔드가 카카오와 통신해 가입+로그인을 한 번에 처리
  let kakaoData: KakaoSignupBackendResponse;
  try {
    kakaoData = await fetchInstanceServer<KakaoSignupBackendResponse>(
      '/oauth/sign-up/kakao',
      { method: 'POST', body }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { message: '카카오 회원가입 중 오류가 발생했습니다.' },
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
