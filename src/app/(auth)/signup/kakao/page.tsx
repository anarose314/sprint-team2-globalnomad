import type { Metadata } from 'next';
import { KakaoNicknameForm } from '@/app/(auth)/signup/kakao/components/kakao-nickname-form';

export const metadata: Metadata = {
  title: '카카오 회원가입',
  description: 'GlobalNomad 카카오 간편 회원가입',
};

export default function KakaoSignupPage() {
  return <KakaoNicknameForm />;
}
