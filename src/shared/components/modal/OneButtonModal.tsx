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
import { Button } from '@/shared/components/buttons/button';
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
      role="alertdialog"
      title={title}
      className="min-h-39 max-w-100 rounded-3xl"
      bodyClassName="px-10 pt-11 pb-0"
      footerClassName="px-10 pt-5 pb-10"
      footer={
        <Button size="lg" onClick={onConfirm} className="w-full max-w-48">
          {buttonText}
        </Button>
      }
    >
      <p className="typo-2lg-bold text-center text-gray-950">{title}</p>
    </ModalBase>
  );
}
