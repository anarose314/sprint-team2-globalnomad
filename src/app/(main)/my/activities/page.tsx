import { Metadata } from 'next';
import { MyPageEmpty } from '@/app/(main)/my/components/my-page-empty';

export const metadata: Metadata = {
  title: '내 체험 관리',
};

export default function MyActivitiesPage() {
  return (
    <>
      <MyPageEmpty
        message="아직 등록한 체험이 없어요"
        buttonLabel="체험 등록하기"
        href="/activity/add"
      />
    </>
  );
}
