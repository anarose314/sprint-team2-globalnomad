import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchActivities } from '@/app/(main)/activity/apis/activities';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';
import { useShowToast } from '@/shared/store/useToastStore';

export const usePatchActivities = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const showToast = useShowToast();

  return useMutation({
    mutationFn: patchActivities,
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ACTIVITIES,
      });

      showToast({
        theme: 'success',
        message: '체험이 성공적으로 수정되었습니다.',
      });

      router.push(`/activity/${variables.activityId}`);
    },
    onError: (error) => {
      console.error('체험 수정 실패:', error);
      showToast({
        theme: 'error',
        message: '체험 수정에 실패했습니다. 다시 시도해 주세요.',
      });
    },
  });
};
