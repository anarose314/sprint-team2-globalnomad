/**
 * one button 모달 컴포넌트
 *
 * - 하나의 확인 버튼만 제공하는 간단한 모달
 * - 사용자에게 알림 또는 확인 메시지를 전달할 때 사용
 * - 확인 버튼 클릭 시 onConfirm 핸들러가 실행됨
 *
 * @example
 * <OneButtonModal
 *   title="삭제가 완료되었습니다."
 *   buttonText="확인"
 *   onConfirm={handleClose}
 * />
 */
import { ModalBase } from '@/shared/components/modal/ModalBase';

interface OneButtonModalProps {
  title: string;
  buttonText?: string;
  onConfirm: () => void;
}

export function OneButtonModal({
  title,
  buttonText = '확인',
  onConfirm,
}: OneButtonModalProps) {
  return (
    <ModalBase
      className="min-h-39 max-w-100 rounded-3xl"
      bodyClassName="px-10 pt-11 pb-0"
      footerClassName="px-10 pt-5 pb-10"
      footer={
        <button
          type="button"
          onClick={onConfirm}
          className="bg-primary-500 h-12 w-full max-w-48 rounded-2xl text-lg font-bold text-white transition-opacity hover:opacity-90"
        >
          {buttonText}
        </button>
      }
    >
      <p className="text-2lg text-center font-bold text-gray-950">{title}</p>
    </ModalBase>
  );
}
