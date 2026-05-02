'use client';

import { ActivityButtons } from '@/app/(main)/my/components/activity-buttons';
import { ReserveButtonsProps } from '@/app/(main)/my/reservations/components/reserve-buttons/reserveButtons.types';
import { Button } from '@/shared/components/buttons';

export function ReserveButtons({ status }: ReserveButtonsProps) {
  // TODO: 예약 변경 이벤트 작성
  const handleChange = () => {
    console.log('예약 변경 이벤트');
  };

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
        <ActivityButtons
          leftText="예약 변경"
          onLeftClick={handleChange}
          rightText="예약 취소"
          onRightClick={handleCancel}
        />
      )}
      {status === 'completed' && (
        <ul className="flex gap-3 [&>li]:flex-1">
          <li>
            <Button size="md" className="w-full" onClick={handleOpenReview}>
              후기 작성
            </Button>
          </li>
        </ul>
      )}
    </>
  );
}
