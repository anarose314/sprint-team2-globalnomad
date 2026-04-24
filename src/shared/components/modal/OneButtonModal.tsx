import { ModalBase } from '@/shared/components/modal/ModalBase';

interface OneButtonModalProps {
  title: string;
  buttonText?: string;
  onConfirm?: () => void;
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
