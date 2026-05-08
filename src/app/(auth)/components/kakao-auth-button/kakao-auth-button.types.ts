import type { KakaoAuthIntent } from '@/shared/apis/auth/kakao';

/**
 * `KakaoAuthButton` 컴포넌트의 props
 */
export type KakaoAuthButtonProps = {
  /**
   * 인증 의도 — 'login' 또는 'signup'
   *
   * 해당 의도에 따라 버튼 텍스트와 콜백 분기가 결정된다.
   */
  intent: KakaoAuthIntent;
};
