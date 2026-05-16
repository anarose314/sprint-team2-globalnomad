import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SignupForm } from '@/app/(auth)/signup/components/signup-form';

export const metadata: Metadata = {
  title: '회원가입 | GlobalNomad',
  description: '여행과 체험을 함께할 GlobalNomad 회원이 되어보세요.',
};

/**
 * 회원가입 페이지 (서버 컴포넌트).
 *
 * metadata 정의를 위해 서버 컴포넌트로 유지하고,
 * 폼 상호작용은 클라이언트 컴포넌트인 SignupForm에서 처리한다.
 *
 * SignupForm 내부의 AuthFooter가 `useSearchParams()`를 사용하므로
 * dynamic 렌더링이 필요하며, Suspense로 감싸 빌드 시 prerender 에러를 방지한다.
 * (?from=원래경로 query를 받아 카카오 OAuth 흐름에 보존하기 위함)
 */
export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
