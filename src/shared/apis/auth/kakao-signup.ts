import type {
  KakaoSignupRequest,
  KakaoSignupResponse,
} from '@/shared/apis/auth/auth.types';
import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';

/**
 * 카카오 간편 회원가입 API 호출 (BFF 경유).
 *
 * Next.js Route Handler (`/api/oauth/kakao/signup`) 를 호출한다.
 * Route Handler 가 백엔드 카카오 회원가입을 수행하고,
 * 받은 토큰을 httpOnly 쿠키로 저장한다.
 * 클라이언트는 user 정보만 응답으로 받는다.
 */
export const kakaoSignup = (params: KakaoSignupRequest) => {
  return fetchInstanceClient<KakaoSignupResponse>('/api/oauth/kakao/signup', {
    method: 'POST',
    body: params,
  });
};
