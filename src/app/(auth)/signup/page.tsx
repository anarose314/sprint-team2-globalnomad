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
 */
export default function SignupPage() {
  return <SignupForm />;
}
