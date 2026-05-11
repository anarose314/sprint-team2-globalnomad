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

/**
 * sessionStorage에 저장된 state 값을 꺼내고 즉시 삭제한다.
 *
 * state는 1회용이므로 꺼낸 직후 삭제하여 재사용을 방지한다.
 *
 */
export const consumeKakaoOAuthState = (): string | null => {
  const state = sessionStorage.getItem(KAKAO_OAUTH_STATE_KEY);
  sessionStorage.removeItem(KAKAO_OAUTH_STATE_KEY);
  return state;
};

/**
 * state 문자열을 intent와 csrfToken으로 분리한다.
 *
 * intent와 csrfToken을 담은 객체, 형식이 잘못되면 null
 *
 * @example
 * parseKakaoOAuthState('signup_a3f8d9e2');
 */
export const parseKakaoOAuthState = (
  state: string
): { intent: KakaoAuthIntent; csrfToken: string } | null => {
  const [intent, ...rest] = state.split('_');
  const csrfToken = rest.join('_');

  if ((intent !== 'signin' && intent !== 'signup') || !csrfToken) {
    return null;
  }

  return { intent, csrfToken };
};

/**
 * 카카오 회원가입 흐름에서 닉네임 입력 페이지로 넘어갈 때
 * 인가 코드와 redirectUri를 sessionStorage에 임시 저장하는 데 사용하는 키.
 */
export const KAKAO_OAUTH_PENDING_SIGNUP_KEY = 'kakao_oauth_pending_signup';

/**
 * 카카오 회원가입 흐름의 임시 저장 데이터.
 * 콜백 페이지에서 닉네임 입력 페이지로 이동하는 동안 보존된다.
 */
export type KakaoPendingSignup = {
  /** 카카오에서 받은 인가 코드 */
  code: string;
  /** 인가 코드 발급 시 사용한 redirectUri */
  redirectUri: string;
};

/**
 * 카카오 회원가입을 위한 임시 데이터를 sessionStorage에 저장한다.
 *
 * 콜백 페이지에서 인가 코드를 받은 직후, 닉네임 입력 페이지로 이동하기 전에 호출.
 */
export const setKakaoPendingSignup = (data: KakaoPendingSignup): void => {
  sessionStorage.setItem(KAKAO_OAUTH_PENDING_SIGNUP_KEY, JSON.stringify(data));
};

/**
 * sessionStorage에서 카카오 회원가입 임시 데이터를 꺼내고 즉시 삭제한다.
 *
 * 닉네임 입력 페이지에서 회원가입 API를 호출하기 직전에 호출.
 *
 */
export const consumeKakaoPendingSignup = (): KakaoPendingSignup | null => {
  const raw = sessionStorage.getItem(KAKAO_OAUTH_PENDING_SIGNUP_KEY);
  sessionStorage.removeItem(KAKAO_OAUTH_PENDING_SIGNUP_KEY);

  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as KakaoPendingSignup;
    if (!parsed.code || !parsed.redirectUri) return null;
    return parsed;
  } catch {
    return null;
  }
};

/**
 * sessionStorage에서 카카오 회원가입 임시 데이터를 꺼내본다 (삭제하지 않음).
 *
 * 닉네임 입력 폼에서 제출 시점에 호출. 재시도 가능성이 있어 즉시 삭제하지 않고
 * 실제 가입이 성공한 시점(`onSuccess`)에서 `consumeKakaoPendingSignup`으로 삭제한다.
 *
 */
export const peekKakaoPendingSignup = (): KakaoPendingSignup | null => {
  const raw = sessionStorage.getItem(KAKAO_OAUTH_PENDING_SIGNUP_KEY);

  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as KakaoPendingSignup;
    if (!parsed.code || !parsed.redirectUri) return null;
    return parsed;
  } catch {
    return null;
  }
};
