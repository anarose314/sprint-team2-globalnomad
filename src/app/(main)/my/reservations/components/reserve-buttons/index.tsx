'use client';

import { ReserveButtonsProps } from '@/app/(main)/my/reservations/components/reserve-buttons/reserveButtons.types';
import { ReserveCancel } from '@/app/(main)/my/reservations/components/reserve-cancel';
import { ReserveReview } from '@/app/(main)/my/reservations/components/reserve-review';

export function ReserveButtons({ reservationInfo }: ReserveButtonsProps) {
  const { status, id, reviewSubmitted } = reservationInfo;

  return (
    <>
      {status === 'pending' && <ReserveCancel reservationId={id} />}
      {status === 'completed' && !reviewSubmitted && (
        <ReserveReview reservationInfo={reservationInfo} />
      )}
    </>
  );
}
