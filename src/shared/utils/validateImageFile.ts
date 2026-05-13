import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  MAX_IMAGE_SIZE_MB,
} from '@/shared/constants/image.constants';

/**
 * 이미지 파일 검증 결과.
 *
 * - 통과: { isValid: true }
 * - 실패: { isValid: false, message: 사용자에게 보여줄 메시지 }
 */
export type ImageFileValidationResult =
  | { isValid: true }
  | { isValid: false; message: string };

/**
 * 업로드 가능한 이미지 파일인지 검증한다.
 *
 * - 크기: 10MB 이하
 * - 타입: JPEG, PNG, WebP
 *
 * @example
 * ```ts
 * const result = validateImageFile(file);
 * if (!result.isValid) {
 *   showToast({ theme: 'error', message: result.message });
 *   return;
 * }
 * ```
 */
export const validateImageFile = (file: File): ImageFileValidationResult => {
  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type as (typeof ALLOWED_IMAGE_TYPES)[number]
    )
  ) {
    return {
      isValid: false,
      message: 'JPG, PNG, WebP 형식만 업로드할 수 있습니다.',
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      isValid: false,
      message: `이미지는 ${MAX_IMAGE_SIZE_MB}MB 이하여야 합니다.`,
    };
  }

  return { isValid: true };
};
