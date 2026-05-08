import type {
  SignupRequest,
  SignupResponse,
} from '@/shared/apis/auth/auth.types';
import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';

/**
 * 회원가입 API 호출 (BFF 경유).
 *
 * Next.js Route Handler (`/api/auth/signup`) 를 호출한다.
 * Route Handler 가 백엔드 회원가입 + 자동 로그인을 수행하고,
 * 받은 토큰을 httpOnly 쿠키로 저장한다.
 * 클라이언트는 user 정보만 응답으로 받는다.
 *
 */
export const signup = (params: SignupRequest) => {
  return fetchInstanceClient<SignupResponse>('/api/auth/signup', {
    method: 'POST',
    body: params,
  });
};
