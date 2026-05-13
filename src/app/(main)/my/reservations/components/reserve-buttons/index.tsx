'use client';

import { ReserveButtonsProps } from '@/app/(main)/my/reservations/components/reserve-buttons/reserveButtons.types';
import { ReserveReview } from '@/app/(main)/my/reservations/components/reserve-review';
import { Button } from '@/shared/components/buttons';

export function ReserveButtons({ reservationInfo }: ReserveButtonsProps) {
  // TODO: 예약 취소 이벤트 작성
  const handleCancel = () => {
    console.log('예약 취소 이벤트');
  };

  return (
    <>
      {reservationInfo.status === 'pending' && (
        <Button
          variant="secondary"
          size="md"
          className="w-full"
          onClick={handleCancel}
        >
          예약 취소
        </Button>
      )}
      {reservationInfo.status === 'completed' && (
        <ReserveReview reservationInfo={reservationInfo} />
      )}
    </>
  );
}
