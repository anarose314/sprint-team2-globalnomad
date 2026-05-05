'use client';

import { ReserveButtonsProps } from '@/app/(main)/my/reservations/components/reserve-buttons/reserveButtons.types';
import { Button } from '@/shared/components/buttons';

export function ReserveButtons({ status }: ReserveButtonsProps) {
  // TODO: 예약 취소 이벤트 작성
  const handleCancel = () => {
    console.log('예약 취소 이벤트');
  };

  // TODO: 후기 작성 모달 오픈
  const handleOpenReview = () => {
    console.log('후기 작성 모달');
  };

  return (
    <>
      {status === 'pending' && (
        <Button
          variant="secondary"
          size="md"
          className="w-full"
          onClick={handleCancel}
        >
          예약 취소
        </Button>
      )}
      {status === 'completed' && (
        <Button size="md" className="w-full" onClick={handleOpenReview}>
          후기 작성
        </Button>
      )}
    </>
  );
}
