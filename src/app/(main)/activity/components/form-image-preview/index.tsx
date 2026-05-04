import Image from 'next/image';
import { IcClose } from '@/shared/assets/icons';

export interface FormImagePreviewProps {
  imageUrl: string;
  imageId: string;
  onImageDelete: (deleteImageId: string) => void;
}

export function FormImagePreview({
  imageUrl,
  imageId,
  onImageDelete,
}: FormImagePreviewProps) {
  return (
    <>
      <figure className="relative aspect-square overflow-hidden rounded-xl border border-gray-100">
        <Image
          src={imageUrl}
          fill
          className="object-cover"
          alt="업로드 된 이미지 미리보기"
        />
      </figure>
      <button
        type="button"
        onClick={() => onImageDelete(imageId)}
        aria-label="업로드된 이미지 삭제"
        className="absolute -top-1.5 -right-1.5 flex h-6.5 w-6.5 cursor-pointer items-center justify-center rounded-full bg-gray-950"
      >
        <IcClose className="w-3/5 text-white" />
      </button>
    </>
  );
}
