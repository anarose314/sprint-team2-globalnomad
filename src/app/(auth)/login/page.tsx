import { Suspense } from 'react';
import type { Metadata } from 'next';
import { LoginForm } from '@/app/(auth)/login/components/login-form';

export const metadata: Metadata = {
  title: '로그인 | GlobalNomad',
  description: 'GlobalNomad 계정으로 로그인하세요.',
};

/**
 * 로그인 페이지 (서버 컴포넌트).
 *
 * metadata 정의를 위해 서버 컴포넌트로 유지하고,
 * 폼 상호작용은 클라이언트 컴포넌트인 LoginForm에서 처리한다.
 *
 * LoginForm 내부의 useLoginMutation이 `useSearchParams()`를 사용하므로
 * dynamic 렌더링이 필요하며, Suspense로 감싸 빌드 시 prerender 에러를 방지한다.
 * (?from=원래경로 query를 받아 로그인 후 해당 경로로 redirect하기 위함)
 */
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
