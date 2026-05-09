import { Suspense } from 'react';
import { KakaoCallback } from '@/app/oauth/kakao/components/kakao-callback';

/**
 * 카카오 OAuth 콜백 페이지.
 *
 * 실제 콜백 로직은 `useSearchParams()`를 사용하므로 dynamic 렌더링이 필요하다.
 * 빌드 시 prerender 에러를 피하기 위해 Suspense로 감싸 dynamic boundary를 명시한다.
 */
export default function KakaoCallbackPage() {
  return (
    <Suspense fallback={<KakaoCallbackFallback />}>
      <KakaoCallback />
    </Suspense>
  );
}

const KakaoCallbackFallback = () => (
  <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
    <p className="text-lg text-gray-700">카카오 로그인 처리 중...</p>
  </main>
);
