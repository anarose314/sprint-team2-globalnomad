import { Metadata } from 'next';
import { MyPageHeader } from '@/app/(main)/my/components/my-page-header';
import { ProfileForm } from '@/app/(main)/my/profile/components/profile-form';

export const metadata: Metadata = {
  title: '내 정보',
};

export default function ProfilePage() {
  return (
    <section className="flex flex-col gap-8">
      <MyPageHeader
        title="내 정보"
        description="닉네임과 비밀번호를 수정하실 수 있습니다."
      />
      <ProfileForm />
    </section>
  );
}
