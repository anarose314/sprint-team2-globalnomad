/**
 * 이미지 URL을 안전한 표시용 URL로 정규화한다.
 *
 * 규칙:
 * - 빈 값은 null 반환
 * - http:// 는 https:// 로 승격
 * - https:// 는 그대로 허용
 * - 그 외 상대 경로는 fallbackBaseUrl 기준 절대 URL로 변환
 * - URL 파싱 실패 시 null 반환
 */
export const resolveSafeImageUrl = (
  imageUrl: string | null | undefined,
  fallbackBaseUrl: string
) => {
  const raw = imageUrl?.trim();
  if (!raw) return null;

  if (raw.startsWith('http://')) {
    return raw.replace(/^http:\/\//, 'https://');
  }

  if (raw.startsWith('https://')) {
    return raw;
  }

  try {
    return new URL(raw, fallbackBaseUrl).toString();
  } catch {
    return null;
  }
};
