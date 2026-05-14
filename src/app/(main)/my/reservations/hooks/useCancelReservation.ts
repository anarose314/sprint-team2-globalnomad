import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchMyReservation } from '@/app/(main)/my/reservations/apis/myReservations';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';
import { useShowToast } from '@/shared/store/useToastStore';

/**
 * 예약 내역 페이지에서 사용하는 예약 취소 커스텀 훅
 *
 * 성공 시 예약 리스트 캐시를 무효화하여 최신 상태를 유지하며 성공 토스트를 표시
 * 실패 시 콘솔에 에러를 기록하고 에러 토스트를 표시
 */
export const useCancelReservation = () => {
  const queryClient = useQueryClient();
  const showToast = useShowToast();

  return useMutation({
    mutationFn: patchMyReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MY_RESERVATIONS],
      });
      showToast({
        theme: 'success',
        message: '예약이 성공적으로 취소되었습니다.',
      });
    },
    onError: (error) => {
      console.error('예약 취소 실패:', error);
      showToast({
        theme: 'error',
        message: '예약 취소에 실패했습니다. 다시 시도해 주세요.',
      });
    },
  });
};
