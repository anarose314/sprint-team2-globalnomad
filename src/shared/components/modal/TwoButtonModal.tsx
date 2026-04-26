import { ModalBase } from '@/shared/components/modal/ModalBase';

interface TwoButtonModalProps {
  title: string;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export function TwoButtonModal({
  title,
  cancelText = '아니오',
  confirmText = '확인',
  onCancel,
  onConfirm,
}: TwoButtonModalProps) {
  return (
    <ModalBase
      className="min-h-39 max-w-100 rounded-3xl"
      bodyClassName="px-10 pt-11 pb-0"
      footerClassName="px-10 pt-5 pb-10"
      footer={
        <div className="flex w-full items-center justify-center gap-4.5">
          <button
            type="button"
            onClick={onCancel}
            className="h-12 w-full max-w-31.5 rounded-[14px] border border-gray-300 bg-white text-lg font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="bg-primary-500 h-12 w-full max-w-31.5 rounded-[14px] text-lg font-semibold text-white transition-opacity hover:opacity-90"
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <p className="text-2lg text-center font-bold text-gray-950">{title}</p>
    </ModalBase>
  );
}
