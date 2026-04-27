/**
 * 두 개의 액션 버튼을 제공하는 공통 모달 컴포넌트입니다.
 *
 * - 취소/확인처럼 사용자가 선택지를 결정해야 하는 상황에 사용합니다.
 * - ModalBase를 기반으로 하며, 버튼 텍스트와 클릭 핸들러를 props로 전달받습니다.
 *
 * @example
 * <TwoButtonModal
 *   message="예약을 취소하시겠어요?"
 *   cancelText="아니오"
 *   confirmText="네"
 *   onCancel={handleClose}
 *   onConfirm={handleConfirm}
 * />
 */
import { Button } from '@/shared/components/buttons/button';
import { ModalBase } from '@/shared/components/modal/ModalBase';

interface TwoButtonModalProps {
  message: string;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export function TwoButtonModal({
  message: title,
  cancelText = '아니오',
  confirmText = '확인',
  onCancel,
  onConfirm,
}: TwoButtonModalProps) {
  return (
    <ModalBase
      className="min-h-39 max-w-100"
      bodyClassName="px-10 pt-11 pb-0"
      footerClassName="px-10 pt-5 pb-10"
      footer={
        <div className="flex w-full items-center justify-center gap-4.5">
          <Button
            variant="secondary"
            size="lg"
            onClick={onCancel}
            className="w-full max-w-31.5"
          >
            {cancelText}
          </Button>

          <Button
            variant="primary"
            size="lg"
            onClick={onConfirm}
            className="w-full max-w-31.5"
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <p className="typo-2lg-bold text-center text-gray-950">{title}</p>
    </ModalBase>
  );
}
