import { Metadata } from 'next';
import { ActivityButton } from '@/app/(main)/my/activities/components/activityAddButton';
import { MyActivitiesList } from '@/app/(main)/my/activities/components/my-activities-list';
import { MyPageHeader } from '@/app/(main)/my/components/my-page-header';

export const metadata: Metadata = {
  title: '내 체험 관리',
};

export default function MyActivitiesPage() {
  return (
    <section className="pb-16 2xl:pb-40">
      <MyPageHeader
        title="내 체험 관리"
        description="체험을 등록하거나 수정 및 삭제가 가능합니다."
      >
        <ActivityButton />
      </MyPageHeader>
      <MyActivitiesList />
    </section>
  );
}
