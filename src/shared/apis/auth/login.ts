import type {
  LoginRequest,
  LoginResponse,
} from '@/shared/apis/auth/auth.types';
import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';

/**
 * 로그인 API 호출 (BFF 경유).
 *
 * 우리의 Next.js Route Handler (`/api/auth/login`) 를 호출한다.
 * Route Handler 가 실제 백엔드를 호출하고, 받은 토큰을 httpOnly 쿠키로 저장한다.
 * 클라이언트는 user 정보만 응답으로 받는다.
 *
 */
export const login = (params: LoginRequest) => {
  return fetchInstanceClient<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: params,
  });
};
