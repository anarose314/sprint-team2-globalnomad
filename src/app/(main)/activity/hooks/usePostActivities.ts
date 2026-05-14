import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postActivities } from '@/app/(main)/activity/apis/activities';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';
import { useShowToast } from '@/shared/store/useToastStore';

/**
 * 체험 등록 커스텀 훅
 * 성공 시 체험 목록 캐시를 무효화하고 생성된 체험의 상세 페이지로 이동
 */
export const usePostActivities = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const showToast = useShowToast();

  return useMutation({
    mutationFn: postActivities,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ACTIVITIES],
      });

      showToast({
        theme: 'success',
        message: '체험이 성공적으로 등록되었습니다.',
      });

      router.push(`/activity/${data.id}`);
    },
    onError: (error) => {
      console.error('체험 등록 실패:', error);
      showToast({
        theme: 'error',
        message: '체험 등록에 실패했습니다. 다시 시도해 주세요.',
      });
    },
  });
};
