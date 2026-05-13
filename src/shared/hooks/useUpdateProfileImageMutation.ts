import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateMyInfo,
  uploadProfileImage,
} from '@/app/(main)/my/profile/apis/myInfo';
import { ApiError } from '@/shared/apis/apiError';
import type { User } from '@/shared/apis/auth/auth.types';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';
import { useShowToast } from '@/shared/store/useToastStore';

/**
 * 프로필 이미지 변경 mutation 훅.
 *
 * 두 단계를 단일 mutation으로 묶어 처리한다:
 * 1. POST /users/me/image — 이미지 업로드 후 URL 발급
 * 2. PATCH /users/me — 받은 URL로 user의 profileImageUrl 갱신
 *
 * 어느 단계든 실패하면 onError로 흐른다.
 * 성공 시 캐시(MY_INFO)에 업데이트된 user를 직접 반영하므로,
 * useMyInfo를 호출하는 모든 컴포넌트(사이드바, 마이페이지 등)가 자동 리렌더된다.
 */
export const useUpdateProfileImageMutation = () => {
  const queryClient = useQueryClient();
  const showToast = useShowToast();

  return useMutation<User, ApiError, File>({
    mutationFn: async (file) => {
      const { profileImageUrl } = await uploadProfileImage(file);
      const updatedUser = await updateMyInfo({ profileImageUrl });
      return updatedUser;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(QUERY_KEYS.MY_INFO, updatedUser);
      showToast({
        theme: 'success',
        message: '프로필 이미지가 변경되었습니다.',
      });
    },
    onError: (error) => {
      showToast({
        theme: 'error',
        message: error.message ?? '이미지 변경에 실패했습니다.',
      });
    },
  });
};
