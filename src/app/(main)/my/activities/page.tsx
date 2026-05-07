import { Metadata } from 'next';
import { MyActivitiesList } from '@/app/(main)/my/activities/components/my-activities-list';
import { MyPageHeader } from '@/app/(main)/my/components/my-page-header';
import { Button } from '@/shared/components/buttons';

export const metadata: Metadata = {
  title: '내 체험 관리',
};

export default function MyActivitiesPage() {
  return (
    <>
      <MyPageHeader
        title="내 체험 관리"
        description="체험을 등록하거나 수정 및 삭제가 가능합니다."
      >
        <Button className="w-full">체험 등록하기</Button>
      </MyPageHeader>
      <MyActivitiesList />
    </>
  );
}
