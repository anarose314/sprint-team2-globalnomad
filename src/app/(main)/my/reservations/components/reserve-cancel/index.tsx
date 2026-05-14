'use client';

import { useCancelReservation } from '@/app/(main)/my/reservations/hooks/useCancelReservation';
import { Button } from '@/shared/components/buttons';
import { TwoButtonModal } from '@/shared/components/modal';
import { ModalOverlay } from '@/shared/components/modal/modal-overlay';
import { useModal } from '@/shared/hooks/useModal';

export interface ReserveCancelProps {
  reservationId: number;
}

export function ReserveCancel({ reservationId }: ReserveCancelProps) {
  const { mutate: cancelReservation, isPending } = useCancelReservation();
  const { isOpen, openModal, closeModal } = useModal();

  const handleCancel = () => {
    cancelReservation(
      { reservationId },
      {
        onSuccess: () => {
          closeModal();
        },
      }
    );
  };

  return (
    <>
      <Button
        variant="secondary"
        size="md"
        className="w-full"
        onClick={openModal}
        disabled={isPending}
      >
        {isPending ? '취소 중...' : '예약 취소'}
      </Button>
      {isOpen && (
        <ModalOverlay onClose={closeModal}>
          <TwoButtonModal
            message="예약을 취소하시겠습니까?"
            cancelText="아니오"
            confirmText="네"
            onCancel={closeModal}
            onConfirm={handleCancel}
          />
        </ModalOverlay>
      )}
    </>
  );
}
