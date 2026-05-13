import { useState } from 'react';
import { ReserveReviewProps } from '@/app/(main)/my/reservations/components/reserve-review/reserveReview.types';
import { useReviewMutation } from '@/app/(main)/my/reservations/hooks/useReviewMutation';
import { Button } from '@/shared/components/buttons';
import { ReviewModal } from '@/shared/components/modal';
import { ModalOverlay } from '@/shared/components/modal/modal-overlay';
import { useModal } from '@/shared/hooks/useModal';
import { useShowToast } from '@/shared/store/useToastStore';

export function ReserveReview({ reservationInfo }: ReserveReviewProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);

  const { mutate: submitReview, isPending } = useReviewMutation(closeModal);

  const showToast = useShowToast();
  const { title, description } = reservationInfo;

  const handleReview = () => {
    if (rating === 0) {
      showToast({
        theme: 'error',
        message: '체험에 대한 별점을 남겨주세요.',
      });
      return;
    }

    if (!reviewText.trim()) {
      showToast({
        theme: 'error',
        message: '소중한 경험을 최소 1자 이상 남겨주세요.',
      });
      return;
    }

    if (reservationInfo.reviewSubmitted) {
      showToast({ theme: 'error', message: '이미 리뷰를 작성하셨습니다.' });
      return;
    }

    submitReview({
      reservationId: reservationInfo.id,
      body: {
        rating,
        content: reviewText,
      },
    });
  };

  return (
    <>
      <Button size="md" className="w-full" onClick={openModal}>
        후기 작성
      </Button>
      {isOpen && (
        <ModalOverlay onClose={closeModal}>
          <ReviewModal
            title={title}
            description={description}
            reviewText={reviewText}
            selectedRating={rating}
            onRatingChange={(value) => setRating(value)}
            onReviewTextChange={(value) => setReviewText(value)}
            onClose={closeModal}
            onSubmit={handleReview}
            isPending={isPending}
          />
        </ModalOverlay>
      )}
    </>
  );
}
