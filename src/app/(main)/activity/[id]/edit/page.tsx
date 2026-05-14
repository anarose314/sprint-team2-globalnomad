import { Metadata } from 'next';
import { ActivityEditForm } from '@/app/(main)/activity/[id]/edit/components/activity-edit-form';
import { ActivityEditPageProps } from '@/app/(main)/activity/[id]/edit/edit.types';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';
import { Heading } from '@/shared/components/heading';
import { ActivityDetailResponse } from '@/shared/types/activityDetail.types';

/**
 * 동적 메타데이터 생성
 */
export async function generateMetadata({
  params,
}: ActivityEditPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const activity = await fetchInstanceServer<ActivityDetailResponse>(
      `/activities/${id}`
    );
    return { title: `${activity.title} - 수정` };
  } catch {
    return { title: '체험 수정' };
  }
}

export default async function ActivityEditPage({
  params,
}: ActivityEditPageProps) {
  const { id } = await params;
  const activityId = Number(id);

  return (
    <div className="mx-auto mt-7.5 mb-9 w-full max-w-175 md:mt-10 md:mb-16 2xl:mb-30">
      <Heading>내 체험 수정</Heading>
      <ActivityEditForm activityId={activityId} />
    </div>
  );
}
