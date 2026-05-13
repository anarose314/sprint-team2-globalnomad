import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMyInfo } from '@/app/(main)/my/profile/apis/myInfo';
import { ApiError } from '@/shared/apis/apiError';
import type { User } from '@/shared/apis/auth/auth.types';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';
import { useShowToast } from '@/shared/store/useToastStore';

/**
 * 프로필 이미지 제거 mutation 훅.
 *
 * PATCH /users/me에 profileImageUrl을 null로 보내 user의 이미지 연결을 해제한다.
 * '제거'라는 사용자 의도를 명확히 전달하기 위해 useUpdateMyInfoMutation과 분리한다.
 *
 * @example
 * ```ts
 * const { mutate: removeProfileImage, isPending } = useRemoveProfileImageMutation();
 * removeProfileImage();
 * ```
 */
export const useRemoveProfileImageMutation = () => {
  const queryClient = useQueryClient();
  const showToast = useShowToast();

  return useMutation<User, ApiError, void>({
    mutationFn: () => updateMyInfo({ profileImageUrl: null }),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(QUERY_KEYS.MY_INFO, updatedUser);
      showToast({
        theme: 'success',
        message: '프로필 이미지가 삭제되었습니다.',
      });
    },
    onError: (error) => {
      showToast({
        theme: 'error',
        message: error.message ?? '이미지 삭제에 실패했습니다.',
      });
    },
  });
};
