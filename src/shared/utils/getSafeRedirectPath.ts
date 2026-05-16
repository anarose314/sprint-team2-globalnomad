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
 * - `/\`로 시작 (백슬래시 우회): 차단 (일부 브라우저가 \를 /로 정규화하여
 *    /\evil.com → //evil.com 으로 해석할 수 있음)
 * - URL 디코딩 후 위 패턴이 나타나는 경우: 차단 (인코딩 우회 방어)
 * - 디코딩 후 protocol 포함 (`javascript:`, `http:` 등): 차단
 *
 * from 검증할 경로 (보통 searchParams.get('from')의 결과)
 * 안전한 경로. 검증 실패 시 MAIN_PATH(메인 페이지) 반환.
 *
 * @example
 * getSafeRedirectPath('/my/profile')           // → '/my/profile'
 * getSafeRedirectPath('https://evil.com')      // → '/'
 * getSafeRedirectPath('//evil.com')            // → '/'
 * getSafeRedirectPath('/\\evil.com')           // → '/' (백슬래시 우회)
 * getSafeRedirectPath('javascript:alert(1)')   // → '/'
 * getSafeRedirectPath('%2F%2Fevil.com')        // → '/' (인코딩 우회)
 * getSafeRedirectPath('%2F%5Cevil.com')        // → '/' (인코딩된 백슬래시)
 * getSafeRedirectPath(null)                    // → '/'
 */
export const getSafeRedirectPath = (
  from: string | null | undefined
): string => {
  if (!from) return MAIN_PATH;

  // 1. '/'로 시작해야 내부 경로
  if (!from.startsWith('/')) return MAIN_PATH;

  // 2. '//' 또는 '/\'로 시작하면 protocol-relative URL (외부 사이트 가능)
  //    일부 브라우저는 \를 /로 정규화하여 /\evil.com을 //evil.com 처럼 해석
  if (from.startsWith('//') || from.startsWith('/\\')) return MAIN_PATH;

  // 3. URL 디코딩 후 검증 (인코딩 우회 방어)
  //    예: %2F%2Fevil.com → //evil.com, %2F%5Cevil.com → /\evil.com
  try {
    const decoded = decodeURIComponent(from);
    if (decoded.startsWith('//') || decoded.startsWith('/\\')) return MAIN_PATH;

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
