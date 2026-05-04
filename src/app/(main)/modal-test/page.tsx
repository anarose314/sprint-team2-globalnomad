'use client';

import { useState } from 'react';
import { ModalBase } from '@/shared/components/modal/ModalBase';
import { OneButtonModal } from '@/shared/components/modal/OneButtonModal';
import { ReviewModal } from '@/shared/components/modal/ReviewModal';
import { TwoButtonModal } from '@/shared/components/modal/TwoButtonModal';

export default function Page() {
  const [openedModal, setOpenedModal] = useState<
    'base' | 'one' | 'two' | 'review' | null
  >(null);
  const [reviewText, setReviewText] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);

  const handleCloseModal = () => {
    setOpenedModal(null);
  };

  const handleReviewSubmit = () => {
    setOpenedModal(null);
  };

  return (
    <div className="flex min-h-screen flex-col gap-10 bg-gray-500 p-10">
      <section className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-gray-950">Modal Test</h1>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setOpenedModal('base')}
            className="bg-primary-500 rounded-2xl px-5 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
          >
            ModalBase 보기
          </button>

          <button
            type="button"
            onClick={() => setOpenedModal('one')}
            className="bg-primary-500 rounded-2xl px-5 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
          >
            OneButtonModal 보기
          </button>

          <button
            type="button"
            onClick={() => setOpenedModal('two')}
            className="bg-primary-500 rounded-2xl px-5 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
          >
            TwoButtonModal 보기
          </button>

          <button
            type="button"
            onClick={() => setOpenedModal('review')}
            className="bg-primary-500 rounded-2xl px-5 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
          >
            ReviewModal 보기
          </button>
        </div>
      </section>

      {openedModal === 'base' ? (
        <ModalBase
          title="모달 베이스"
          onClose={handleCloseModal}
          footer={
            <>
              <button
                type="button"
                onClick={handleCloseModal}
                className="h-12 min-w-[120px] rounded-2xl border border-gray-300 bg-white px-6 text-lg font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                취소
              </button>

              <button
                type="button"
                onClick={handleCloseModal}
                className="bg-primary-500 h-12 min-w-[120px] rounded-2xl px-6 text-lg font-semibold text-white transition-opacity hover:opacity-90"
              >
                확인
              </button>
            </>
          }
        >
          <p className="text-lg text-gray-800">모달 내용입니다</p>
        </ModalBase>
      ) : null}

      {openedModal === 'one' ? (
        <OneButtonModal
          message="완료되었습니다."
          buttonText="확인"
          onConfirm={handleCloseModal}
        />
      ) : null}

      {openedModal === 'two' ? (
        <TwoButtonModal
          message="예약을 취소하시겠어요?"
          cancelText="아니오"
          confirmText="확인"
          onCancel={handleCloseModal}
          onConfirm={handleCloseModal}
        />
      ) : null}

      {openedModal === 'review' ? (
        <ReviewModal
          title="함께 배우면 즐거운 스트릿 댄스"
          dateText="2023. 02. 14 / 11:00 - 12:30 (10명)"
          reviewText={reviewText}
          selectedRating={selectedRating}
          onRatingChange={setSelectedRating}
          onReviewTextChange={setReviewText}
          onClose={handleCloseModal}
          onSubmit={handleReviewSubmit}
        />
      ) : null}
    </div>
  );
}
