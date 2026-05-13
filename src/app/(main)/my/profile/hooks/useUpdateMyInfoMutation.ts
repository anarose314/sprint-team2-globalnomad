import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateMyInfo,
  type UpdateMyInfoBody,
} from '@/app/(main)/my/profile/apis/myInfo';
import { ApiError } from '@/shared/apis/apiError';
import type { User } from '@/shared/apis/auth/auth.types';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';
import { useShowToast } from '@/shared/store/useToastStore';

/**
 * 내 정보 수정 mutation 훅.
 *
 * - 성공 시: 응답 user를 캐시에 직접 반영(setQueryData) + 성공 토스트
 * - 실패 시: 에러 메시지로 실패 토스트
 *
 * 호출 측은 변경된 필드만 담은 페이로드를 전달한다.
 *
 * @example
 * ```ts
 * const { mutate, isPending } = useUpdateMyInfoMutation();
 * mutate({ nickname: '새이름' });
 * ```
 */
export const useUpdateMyInfoMutation = () => {
  const queryClient = useQueryClient();
  const showToast = useShowToast();

  return useMutation<User, ApiError, UpdateMyInfoBody>({
    mutationFn: updateMyInfo,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(QUERY_KEYS.MY_INFO, updatedUser);
      showToast({ theme: 'success', message: '저장되었습니다.' });
    },
    onError: (error) => {
      showToast({
        theme: 'error',
        message: error.message ?? '저장에 실패했습니다.',
      });
    },
  });
};
