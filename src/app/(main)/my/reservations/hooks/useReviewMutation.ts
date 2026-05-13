'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postReviews } from '@/app/(main)/my/reservations/apis/myReservations';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';
import { useShowToast } from '@/shared/store/useToastStore';

/**
 * 리뷰 작성 API를 호출하고 완료 후의 사이드 이펙트를 처리하는 커스텀 훅
 *
 * 성공 시 예약 내역 캐시를 무효화하여 리스트를 최신 상태(리뷰 작성 완료 상태)로 갱신,
 * 성공 토스트 메시지를 띄운 후 전달받은 콜백 함수를 통해 모달을 닫음
 */
export const useReviewMutation = (onCloseModal: () => void) => {
  const queryClient = useQueryClient();
  const showToast = useShowToast();

  return useMutation({
    mutationFn: postReviews,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MY_RESERVATIONS],
      });
      showToast({
        theme: 'success',
        message: '리뷰 작성이 완료되었습니다.',
      });
      onCloseModal();
    },
    onError: (error) => {
      console.error('리뷰 작성 실패:', error);
      showToast({
        theme: 'error',
        message: '리뷰 작성에 실패했습니다. 다시 시도해 주세요.',
      });
    },
  });
};
