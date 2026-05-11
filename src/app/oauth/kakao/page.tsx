import { Suspense } from 'react';
import { KakaoCallback } from '@/app/oauth/kakao/components/kakao-callback';
import { KakaoCallbackPending } from '@/app/oauth/kakao/components/kakao-callback-pending';

/**
 * 카카오 OAuth 콜백 페이지.
 *
 * 실제 콜백 로직은 `useSearchParams()`를 사용하므로 dynamic 렌더링이 필요하다.
 * 빌드 시 prerender 에러를 피하기 위해 Suspense로 감싸 dynamic boundary를 명시한다.
 */
export default function KakaoCallbackPage() {
  return (
    <Suspense fallback={<KakaoCallbackPending />}>
      <KakaoCallback />
    </Suspense>
  );
}
