import type {
  KakaoSigninRequest,
  KakaoSigninResponse,
} from '@/shared/apis/auth/auth.types';
import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';

/**
 * 카카오 간편 로그인 API 호출 (BFF 경유).
 *
 * Next.js Route Handler (`/api/auth/kakao/signin`) 를 호출한다.
 * Route Handler 가 백엔드 카카오 로그인을 수행하고,
 * 받은 토큰을 httpOnly 쿠키로 저장한다.
 * 클라이언트는 user 정보만 응답으로 받는다.
 *
 * 가입된 카카오 계정이 없는 경우 백엔드는 404를 반환하며,
 * 호출부는 ApiError로 받아 적절한 분기(예: 회원가입 페이지 안내) 처리한다.
 */
export const kakaoSignin = (params: KakaoSigninRequest) => {
  return fetchInstanceClient<KakaoSigninResponse>('/api/auth/kakao/signin', {
    method: 'POST',
    body: params,
  });
};
