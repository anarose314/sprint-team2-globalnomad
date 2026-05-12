import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ActivityDetailPageClient } from '@/app/(main)/activity/[id]/components/activity-detail-page-client';
import { ApiError } from '@/shared/apis/apiError';
import { User } from '@/shared/apis/auth/auth.types';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';
import { ActivityDetailResponse } from '@/shared/types/activityDetail.types';

// TODO: 추후 API 연동 후 동적 메타데이터로 변경
export const metadata: Metadata = {
  title: '체험 이름',
};

interface ActivityDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ActivityDetailPage({
  params,
}: ActivityDetailPageProps) {
  const { id } = await params;
  const activityId = Number(id);

  if (!Number.isFinite(activityId)) {
    notFound();
  }

  let activity: ActivityDetailResponse;

  try {
    activity = await fetchInstanceServer<ActivityDetailResponse>(
      `/activities/${activityId}`
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  let currentUserId: number | null = null;
  try {
    const me = await fetchInstanceServer<User>('/users/me');
    currentUserId = me.id;
  } catch {
    currentUserId = null;
  }

  const isOwner = currentUserId === activity.userId;

  return <ActivityDetailPageClient activity={activity} isOwner={isOwner} />;
}
