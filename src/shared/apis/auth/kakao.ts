/**
 * 카카오 OAuth 인증 흐름 관련 유틸
 *
 * 인가 URL 빌더, state 관리 등을 담당.
 * 컴포넌트가 아닌 순수 함수 모음 — UI와 분리되어 있어 테스트와 재사용이 쉬움.
 */

const KAKAO_AUTHORIZE_BASE_URL = 'https://kauth.kakao.com/oauth/authorize';

/** sessionStorage에 저장할 state 키 — 빌더와 콜백이 공유 */
export const KAKAO_OAUTH_STATE_KEY = 'kakao_oauth_state';

/** 카카오 인증 의도 — 콜백에서 분기 처리에 사용 */
export type KakaoAuthIntent = 'signin' | 'signup';

/**
 * 카카오 인가(authorization) URL을 생성하고, CSRF 검증용 state를 sessionStorage에 저장한다.
 *
 * @example
 * ```ts
 * const url = buildKakaoAuthUrl('signup');
 * window.location.href = url;
 * ```
 */
export const buildKakaoAuthUrl = (intent: KakaoAuthIntent): string => {
  const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error(
      'Kakao OAuth 환경변수가 설정되지 않았습니다. ' +
        'NEXT_PUBLIC_KAKAO_CLIENT_ID, NEXT_PUBLIC_KAKAO_REDIRECT_URI를 확인해주세요.'
    );
  }

  const csrfToken = crypto.randomUUID();
  const state = `${intent}_${csrfToken}`;

  sessionStorage.setItem(KAKAO_OAUTH_STATE_KEY, state);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    state,
  });

  return `${KAKAO_AUTHORIZE_BASE_URL}?${params.toString()}`;
};
