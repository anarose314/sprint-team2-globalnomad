/**
 * 카카오 콜백 처리 중 표시되는 로딩 화면.
 *
 * 두 군데에서 동일한 화면을 보여주기 위해 분리됨:
 * - Suspense fallback (useSearchParams 준비 전)
 * - KakaoCallback 컴포넌트의 렌더 (실제 처리 중)
 *
 * 두 단계의 화면이 같아야 마운트 시점에 깜빡임이 발생하지 않는다.
 */
export function KakaoCallbackPending() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <p className="text-lg text-gray-700">카카오 로그인 처리 중...</p>
    </main>
  );
}
