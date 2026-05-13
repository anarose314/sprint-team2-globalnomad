import type { User } from '@/shared/apis/auth/auth.types';
import { fetchInstanceClient } from '@/shared/apis/fetchInstance.client';

/**
 * 내 정보를 가져오는 API 호출 함수 (BFF 경유)
 */
export const fetchMyInfo = async () => {
  return await fetchInstanceClient<User>('/api/proxy/users/me');
};

/**
 * 내 정보 수정 API 요청 바디.
 *
 * PATCH 명세상 세 필드 모두 옵셔널이므로 Partial로 표현한다.
 * 호출자는 변경된 필드만 채워서 보낸다.
 */
export type UpdateMyInfoBody = Partial<{
  nickname: string;
  newPassword: string;
  profileImageUrl: string | null;
}>;

/**
 * 내 정보를 수정하는 API 호출 함수 (BFF 경유).
 * 응답으로 업데이트된 user 전체를 받는다.
 */
export const updateMyInfo = async (body: UpdateMyInfoBody) => {
  return await fetchInstanceClient<User>('/api/proxy/users/me', {
    method: 'PATCH',
    body,
  });
};
