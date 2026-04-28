'use client';

import { useState } from 'react';
import { Input } from '@/shared/components/input';
import { ModalOverlay } from '@/shared/components/modal/modal-overlay';
import { OneButtonModal } from '@/shared/components/modal/OneButtonModal';
import { ReviewModal } from '@/shared/components/modal/ReviewModal';
import { TwoButtonModal } from '@/shared/components/modal/TwoButtonModal';

type OpenModalType = 'one' | 'two' | 'review' | null;

// TODO: 인풋 컴포넌트와 모달 컴포넌트의 테스트용 임시 페이지로 작업 완료 후 삭제 예정입니다.
export default function Page() {
  const [openModal, setOpenModal] = useState<OpenModalType>(null);

  const handleClose = () => {
    setOpenModal(null);
  };

  return (
    <main className="flex min-h-screen flex-col gap-10 p-10">
      <section className="flex flex-col gap-6">
        <Input label="이메일" placeholder="이메일을 입력해 주세요" />

        <Input label="비밀번호" placeholder="비밀번호를 입력해 주세요" />

        <Input
          label="닉네임"
          placeholder="닉네임을 입력해 주세요"
          errorMessage="닉네임은 10자 이하로 입력해 주세요."
        />
      </section>

      <section className="flex flex-col items-start gap-4">
        <button
          type="button"
          onClick={() => setOpenModal('one')}
          className="bg-primary-500 rounded px-4 py-2 text-white"
        >
          OneButtonModal 열기
        </button>

        <button
          type="button"
          onClick={() => setOpenModal('two')}
          className="bg-primary-500 rounded px-4 py-2 text-white"
        >
          TwoButtonModal 열기
        </button>

        <button
          type="button"
          onClick={() => setOpenModal('review')}
          className="bg-primary-500 rounded px-4 py-2 text-white"
        >
          ReviewModal 열기
        </button>
      </section>

      {openModal === 'one' && (
        <ModalOverlay onClose={handleClose}>
          <OneButtonModal message="완료되었습니다." onConfirm={handleClose} />
        </ModalOverlay>
      )}

      {openModal === 'two' && (
        <ModalOverlay onClose={handleClose}>
          <TwoButtonModal
            message="삭제하시겠어요?"
            onCancel={handleClose}
            onConfirm={handleClose}
          />
        </ModalOverlay>
      )}

      {openModal === 'review' && (
        <ModalOverlay onClose={handleClose}>
          <ReviewModal
            onClose={handleClose}
            onSubmit={handleClose}
            onRatingChange={() => {}}
            onReviewTextChange={() => {}}
          />
        </ModalOverlay>
      )}
    </main>
  );
}
