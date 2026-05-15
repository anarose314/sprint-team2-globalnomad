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

/**
 * 프로필 이미지 업로드 API 응답.
 */
export type UploadProfileImageResponse = {
  profileImageUrl: string;
};

/**
 * 프로필 이미지 파일을 업로드하고 URL을 받는다 (BFF 경유).
 *
 * 이 API는 URL만 생성하며, user 엔티티의 profileImageUrl을 직접 수정하지 않는다.
 * user에 반영하려면 응답받은 URL로 updateMyInfo를 추가로 호출해야 한다.
 */
export const uploadProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  return await fetchInstanceClient<UploadProfileImageResponse>(
    '/api/proxy/users/me/image',
    {
      method: 'POST',
      body: formData,
    }
  );
};
