import type {
  LoginRequest,
  LoginResponse,
} from '@/shared/apis/auth/auth.types';
import { api } from '@/shared/apis/fetchInstance.core';

/**
 * 로그인 API 호출.
 *
 * 로그인 성공 시 사용자 정보 + 토큰
 * ApiError 인증 실패 (400, 404 등) 시
 */
export const login = (params: LoginRequest) => {
  return api.post<LoginResponse>('/auth/login', params);
};
