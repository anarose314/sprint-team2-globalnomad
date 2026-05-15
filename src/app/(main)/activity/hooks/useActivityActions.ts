'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteActivity } from '@/app/(main)/activity/apis/activities';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';
import { useModal } from '@/shared/hooks/useModal';
import { useShowToast } from '@/shared/store/useToastStore';

interface UseActivityActionsProps {
  initialActivityId?: number;
  onSuccessRedirect?: string;
}

/**
 * 체험 액션(수정, 삭제)을 관리하는 커스텀 훅
 *
 * @example
 * const { handleEdit, handleDeleteRequest } = useActivityActions({ initialActivityId: 1, onSuccessRedirect: '/my/activities' });
 */
export const useActivityActions = ({
  initialActivityId,
  onSuccessRedirect,
}: UseActivityActionsProps = {}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const showToast = useShowToast();
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedId, setSelectedId] = useState<number | null>(
    initialActivityId ?? null
  );

  const handleEdit = (id?: number) => {
    const targetId = id ?? selectedId;
    if (targetId) {
      router.push(`/activity/${targetId}/edit`);
    }
  };

  const handleDeleteRequest = (id?: number) => {
    if (id) setSelectedId(id);
    openModal();
  };

  const handleDeleteCancel = () => {
    if (!initialActivityId) setSelectedId(null);
    closeModal();
  };

  const { mutate: confirmDelete, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => deleteActivity(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ACTIVITIES,
      });
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MY_ACTIVITIES,
      });

      showToast({ theme: 'success', message: '체험이 삭제되었습니다.' });
      closeModal();
      if (!initialActivityId) setSelectedId(null);

      if (onSuccessRedirect) {
        router.replace(onSuccessRedirect);
      }
    },
    onError: (error) => {
      showToast({
        theme: 'error',
        message:
          error instanceof Error
            ? error.message
            : '체험 삭제 중 오류가 발생했습니다.',
      });
      closeModal();
      if (!initialActivityId) setSelectedId(null);
    },
  });

  const handleDeleteConfirm = () => {
    if (selectedId) {
      confirmDelete(selectedId);
    }
  };

  return {
    isDeleting,
    isOpen,
    handleEdit,
    handleDeleteRequest,
    handleDeleteCancel,
    handleDeleteConfirm,
  };
};
