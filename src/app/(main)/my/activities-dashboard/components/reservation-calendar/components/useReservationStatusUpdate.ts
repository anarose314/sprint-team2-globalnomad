import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  approveReservationWithAutoDecline,
  fetchActivityReservations,
  updateActivityReservationStatus,
} from '@/app/(main)/my/activities-dashboard/apis/reservations';
import { QUERY_KEYS } from '@/shared/constants/queryKeys.constants';
import { useShowToast } from '@/shared/store/useToastStore';

type ReservationUpdateStatus = 'confirmed' | 'declined';

type ReservationStatusUpdateAction = {
  reservationId: number;
  status: ReservationUpdateStatus;
  scheduleId: number | null;
} | null;

interface UseReservationStatusUpdateParams {
  activityId: number;
  selectedScheduleId: number | null;
}

export const useReservationStatusUpdate = ({
  activityId,
  selectedScheduleId,
}: UseReservationStatusUpdateParams) => {
  const queryClient = useQueryClient();
  const showToast = useShowToast();
  const [feedbackModalMessage, setFeedbackModalMessage] = useState<
    string | null
  >(null);
  const [pendingStatusUpdateAction, setPendingStatusUpdateAction] =
    useState<ReservationStatusUpdateAction>(null);

  const { mutateAsync: mutateReservationStatus, isPending: isUpdatingStatus } =
    useMutation({
      mutationFn: async ({
        reservationId,
        status,
        scheduleId,
      }: {
        reservationId: number;
        status: ReservationUpdateStatus;
        scheduleId: number | null;
      }) => {
        if (status !== 'confirmed') {
          await updateActivityReservationStatus({
            activityId,
            reservationId,
            status,
          });
          return;
        }

        if (scheduleId === null) {
          await updateActivityReservationStatus({
            activityId,
            reservationId,
            status,
          });
          return;
        }

        const backendHandled = await approveReservationWithAutoDecline({
          activityId,
          reservationId,
          scheduleId,
        });

        if (backendHandled) return;

        await updateActivityReservationStatus({
          activityId,
          reservationId,
          status,
        });

        const autoDeclineTargets: number[] = [];
        const visitedCursorIds = new Set<number>();
        let cursorId: number | null = null;

        do {
          const pendingPage = await fetchActivityReservations({
            activityId,
            scheduleId,
            status: 'pending',
            cursorId,
          });

          pendingPage.reservations.forEach((reservation) => {
            if (reservation.id === reservationId) return;
            autoDeclineTargets.push(reservation.id);
          });

          if (
            pendingPage.cursorId !== null &&
            visitedCursorIds.has(pendingPage.cursorId)
          ) {
            break;
          }
          if (pendingPage.cursorId !== null) {
            visitedCursorIds.add(pendingPage.cursorId);
          }

          cursorId = pendingPage.cursorId;
        } while (cursorId !== null);

        if (autoDeclineTargets.length > 0) {
          await Promise.all(
            autoDeclineTargets.map((targetReservationId) =>
              updateActivityReservationStatus({
                activityId,
                reservationId: targetReservationId,
                status: 'declined',
              })
            )
          );
        }
      },
      onSuccess: async (_, variables) => {
        showToast({
          theme: 'success',
          message:
            variables.status === 'confirmed'
              ? '승인이 완료되었습니다.'
              : '해당 예약신청을 거절했습니다.',
        });
        setFeedbackModalMessage(null);

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
      onError: () => {
        showToast({
          theme: 'error',
          message: '예약 상태 변경에 실패했습니다. 잠시 후 다시 시도해주세요.',
        });
        setFeedbackModalMessage(
          '예약 상태 변경에 실패했습니다.\n잠시 후 다시 시도해주세요.'
        );
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
      scheduleId: selectedScheduleId,
    });
  };

  const handleRejectReservation = (reservationId: number) => {
    setPendingStatusUpdateAction({
      reservationId,
      status: 'declined',
      scheduleId: selectedScheduleId,
    });
  };

  const cancelStatusUpdateConfirmation = () => {
    setPendingStatusUpdateAction(null);
  };

  const confirmStatusUpdate = async () => {
    if (!pendingStatusUpdateAction) return;

    try {
      await mutateReservationStatus({
        reservationId: pendingStatusUpdateAction.reservationId,
        status: pendingStatusUpdateAction.status,
        scheduleId: pendingStatusUpdateAction.scheduleId,
      });

      setPendingStatusUpdateAction(null);
    } catch {
      // 실패 시 확인 모달을 유지해 사용자가 재시도/취소를 선택할 수 있게 한다.
    }
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
