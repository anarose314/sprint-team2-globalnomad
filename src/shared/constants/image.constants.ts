/**
 * 이미지 업로드 허용 최대 크기 (10MB).
 */
export const MAX_IMAGE_SIZE_MB = 10;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

/**
 * 이미지 업로드 허용 MIME 타입.
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

/**
 * HTML <input accept> 속성 값.
 * 시스템 파일 선택 다이얼로그에서 1차 필터로 작동한다.
 */
export const IMAGE_INPUT_ACCEPT = ALLOWED_IMAGE_TYPES.join(',');
