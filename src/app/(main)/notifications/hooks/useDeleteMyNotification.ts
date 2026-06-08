import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMyNotification } from '@/app/(main)/notifications/apis/myNotifications';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';
import { useShowToast } from '@/shared/store/useToastStore';

/**
 * 헤더 알림 드롭다운에서 사용하는 알림 삭제 훅
 *
 * 성공 시 알림 목록 캐시를 무효화하고 성공 토스트를 표시한다.
 * 실패 시 에러 토스트를 표시한다.
 */
export const useDeleteMyNotification = () => {
  const queryClient = useQueryClient();
  const showToast = useShowToast();

  return useMutation({
    mutationFn: deleteMyNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MY_NOTIFICATIONS,
      });

      showToast({
        theme: 'success',
        message: '알림이 삭제되었습니다.',
      });
    },
    onError: () => {
      showToast({
        theme: 'error',
        message: '알림 삭제에 실패했습니다. 다시 시도해 주세요.',
      });
    },
  });
};
