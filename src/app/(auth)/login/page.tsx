import type { Metadata } from 'next';
import { LoginForm } from '@/app/(auth)/login/_components/login-form';

export const metadata: Metadata = {
  title: '로그인 | GlobalNomad',
  description: 'GlobalNomad 계정으로 로그인하세요.',
};

/**
 * 로그인 페이지 (서버 컴포넌트).
 *
 * metadata 정의를 위해 서버 컴포넌트로 유지하고,
 * 폼 상호작용은 클라이언트 컴포넌트인 LoginForm에서 처리한다.
 */
export default function LoginPage() {
  return <LoginForm />;
}
