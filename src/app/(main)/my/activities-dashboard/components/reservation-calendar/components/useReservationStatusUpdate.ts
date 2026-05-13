import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateActivityReservationStatus } from '@/app/(main)/my/activities-dashboard/apis/reservations';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';

type ReservationUpdateStatus = 'confirmed' | 'declined';

type ReservationStatusUpdateAction = {
  reservationId: number;
  status: ReservationUpdateStatus;
} | null;

interface UseReservationStatusUpdateParams {
  activityId: number;
}

export const useReservationStatusUpdate = ({
  activityId,
}: UseReservationStatusUpdateParams) => {
  const queryClient = useQueryClient();
  const [feedbackModalMessage, setFeedbackModalMessage] = useState<
    string | null
  >(null);
  const [pendingStatusUpdateAction, setPendingStatusUpdateAction] =
    useState<ReservationStatusUpdateAction>(null);

  const { mutate: mutateReservationStatus, isPending: isUpdatingStatus } =
    useMutation({
      mutationFn: ({
        reservationId,
        status,
      }: {
        reservationId: number;
        status: ReservationUpdateStatus;
      }) =>
        updateActivityReservationStatus({
          activityId,
          reservationId,
          status,
        }),
      onSuccess: async (_, variables) => {
        setFeedbackModalMessage(
          variables.status === 'confirmed'
            ? '승인이 완료되었습니다.'
            : '해당 예약신청을 거절했습니다.'
        );

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [...QUERY_KEYS.MY_ACTIVITY_RESERVATIONS, activityId],
          }),
          queryClient.invalidateQueries({
            queryKey: [...QUERY_KEYS.MY_ACTIVITY_RESERVED_SCHEDULE, activityId],
          }),
          queryClient.invalidateQueries({
            queryKey: [
              ...QUERY_KEYS.MY_ACTIVITY_RESERVATION_DASHBOARD,
              activityId,
            ],
          }),
        ]);
      },
    });

  const confirmationModalMessage = useMemo(() => {
    if (!pendingStatusUpdateAction) return null;

    return pendingStatusUpdateAction.status === 'confirmed'
      ? '해당 예약 신청을 승인하시겠습니까?\n동시간대의 나머지 예약은 자동으로 거절됩니다.'
      : '해당 예약 신청을 거절하시겠습니까?';
  }, [pendingStatusUpdateAction]);

  const handleApproveReservation = (reservationId: number) => {
    setPendingStatusUpdateAction({
      reservationId,
      status: 'confirmed',
    });
  };

  const handleRejectReservation = (reservationId: number) => {
    setPendingStatusUpdateAction({
      reservationId,
      status: 'declined',
    });
  };

  const cancelStatusUpdateConfirmation = () => {
    setPendingStatusUpdateAction(null);
  };

  const confirmStatusUpdate = () => {
    if (!pendingStatusUpdateAction) return;

    mutateReservationStatus({
      reservationId: pendingStatusUpdateAction.reservationId,
      status: pendingStatusUpdateAction.status,
    });

    setPendingStatusUpdateAction(null);
  };

  const closeFeedbackModal = () => {
    setFeedbackModalMessage(null);
  };

  return {
    isUpdatingStatus,
    confirmationModalMessage,
    feedbackModalMessage,
    handleApproveReservation,
    handleRejectReservation,
    cancelStatusUpdateConfirmation,
    confirmStatusUpdate,
    closeFeedbackModal,
  };
};
