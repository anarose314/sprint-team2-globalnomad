import { MAIN_PATH } from '@/shared/apis/auth/auth.constants';

/**
 * 외부에서 받은 redirect 경로가 안전한지 검증하고, 안전한 경로를 반환한다.
 *
 * Open Redirect 취약점 방어:
 * 사용자에게 보낸 링크에 `?from=https://evil.com` 같이 외부 URL을 박으면
 * 사용자가 로그인 후 피싱 사이트로 유도될 수 있다.
 * 내부 경로만 허용하여 이러한 공격을 차단한다.
 *
 * 검증 규칙:
 * - null/undefined/빈 문자열: 메인 페이지로 fallback
 * - `/`로 시작하지 않음 (상대 경로): 차단
 * - `//`로 시작 (protocol-relative URL): 차단 (//evil.com 형식)
 * - URL 디코딩 후 protocol 포함 (`javascript:`, `http:` 등): 차단
 *
 * from 검증할 경로 (보통 searchParams.get('from')의 결과)
 * 안전한 경로. 검증 실패 시 MAIN_PATH(메인 페이지) 반환.
 *
 * @example
 * getSafeRedirectPath('/my/profile')           // → '/my/profile'
 * getSafeRedirectPath('https://evil.com')      // → '/'
 * getSafeRedirectPath('//evil.com')            // → '/'
 * getSafeRedirectPath('javascript:alert(1)')   // → '/'
 * getSafeRedirectPath(null)                    // → '/'
 */
export const getSafeRedirectPath = (
  from: string | null | undefined
): string => {
  if (!from) return MAIN_PATH;

  // 1. '/'로 시작해야 내부 경로
  if (!from.startsWith('/')) return MAIN_PATH;

  // 2. '//'로 시작하면 protocol-relative URL (외부 사이트 가능)
  if (from.startsWith('//')) return MAIN_PATH;

  // 3. URL 디코딩 후 검증 (인코딩 우회 방어)
  //    예: %2F%2Fevil.com → //evil.com
  try {
    const decoded = decodeURIComponent(from);
    if (decoded.startsWith('//')) return MAIN_PATH;
    // protocol 문자 (`:`)가 첫 '/' 이전에 있으면 위험
    // 예: javascript:..., http:..., //evil.com 등
    const firstSlashIndex = decoded.indexOf('/');
    const firstColonIndex = decoded.indexOf(':');
    if (firstColonIndex !== -1 && firstColonIndex < firstSlashIndex) {
      return MAIN_PATH;
    }
  } catch {
    // 디코딩 실패는 잘못된 형식 — fallback
    return MAIN_PATH;
  }

  return from;
};
