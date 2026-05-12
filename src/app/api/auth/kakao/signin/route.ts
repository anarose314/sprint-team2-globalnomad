/**
 * POST /api/auth/kakao/signin
 *
 * 카카오 간편 로그인 BFF 엔드포인트.
 *
 * 1. 클라이언트에서 보낸 카카오 인가 코드(token)와 redirectUri 를 받아
 * 2. body 형태를 Zod로 검증한 후
 * 3. 실제 백엔드(GlobalNomad API)에 카카오 로그인 요청을 보낸다.
 * 4. 백엔드가 카카오와 통신해 사용자 인증 후 토큰과 user 정보를 반환한다.
 * 5. 받은 토큰을 httpOnly 쿠키로 저장해서 응답한다.
 *
 * 회원가입과 달리 단일 호출로 인증이 완료되며, 가입된 카카오 계정이 없으면
 * 백엔드가 404를 반환한다. (호출부는 404를 회원가입 안내로 처리)
 *
 * 에러 처리:
 * - 400: 잘못된 요청 형식 (JSON 파싱 실패 또는 body 스키마 위반)
 * - 404: 가입되지 않은 카카오 계정 — 클라이언트가 회원가입 흐름으로 안내
 * - 4xx/5xx: 백엔드 API 에러를 ApiError로 받아 그대로 전달
 * - 500: 예상치 못한 서버 에러
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ApiError } from '@/shared/apis/apiError';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from '@/shared/apis/auth/auth.constants';
import type { KakaoSigninBackendResponse } from '@/shared/apis/auth/auth.types';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';

/**
 * 카카오 로그인 요청 body 스키마.
 * 클라이언트가 보낸 body가 우리가 기대하는 모양인지 BFF에서 검증한다.
 */
const kakaoSigninBodySchema = z.object({
  token: z.string().min(1, '토큰이 필요합니다.'),
  redirectUri: z.string().min(1, '리다이렉트 URI가 필요합니다.'),
});

export const POST = async (request: NextRequest) => {
  // 요청 body JSON 파싱
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { message: '잘못된 요청 형식입니다.' },
      { status: 400 }
    );
  }

  // body 스키마 검증
  const validation = kakaoSigninBodySchema.safeParse(rawBody);
  if (!validation.success) {
    return NextResponse.json(
      {
        message:
          validation.error.issues[0]?.message ?? '잘못된 요청 형식입니다.',
      },
      { status: 400 }
    );
  }

  const body = validation.data;

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
