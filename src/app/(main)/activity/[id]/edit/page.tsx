import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { ActivityEditForm } from '@/app/(main)/activity/[id]/edit/components/activity-edit-form';
import { ActivityEditPageProps } from '@/app/(main)/activity/[id]/edit/edit.types';
import { ActivityFormSkeleton } from '@/app/(main)/activity/components/activity-form-skeleton';
import { ApiError } from '@/shared/apis/apiError';
import { LOGIN_PATH } from '@/shared/apis/auth/auth.constants';
import type { User } from '@/shared/apis/auth/auth.types';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';
import { Heading } from '@/shared/components/heading';
import { URL_QUERY_ERRORS } from '@/shared/constants/queryKeys.constants';
import type { ActivityDetailResponse } from '@/shared/types/activityDetail.types';

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
    return {
      title: `${activity.title} - 수정`,
      description: activity.description
        ? `${activity.title} 체험의 상세 정보와 스케줄을 수정합니다.`
        : '등록한 체험의 상세 정보와 스케줄을 수정할 수 있는 페이지입니다.',
    };
  } catch {
    return {
      title: '체험 수정',
      description:
        '등록한 체험의 상세 정보와 스케줄을 수정할 수 있는 페이지입니다.',
    };
  }
}

export default async function ActivityEditPage({
  params,
}: ActivityEditPageProps) {
  const { id } = await params;
  const activityId = Number(id);

  if (!Number.isFinite(activityId)) {
    notFound();
  }

  const [meResult, activityResult] = await Promise.allSettled([
    fetchInstanceServer<User>('/users/me', { cache: 'no-store' }),
    fetchInstanceServer<ActivityDetailResponse>(`/activities/${activityId}`, {
      cache: 'no-store',
    }),
  ]);

  const me = meResult.status === 'fulfilled' ? meResult.value : null;

  if (activityResult.status === 'rejected') {
    const error = activityResult.reason;
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const activity = activityResult.value;

  if (!me) {
    redirect(`${LOGIN_PATH}?from=/activity/${activityId}/edit`);
  }

  if (activity.userId !== me.id) {
    redirect(`/activity/${activityId}?error=${URL_QUERY_ERRORS.UNAUTHORIZED}`);
  }

  return (
    <div className="mx-auto mt-7.5 mb-9 w-full max-w-175 md:mt-10 md:mb-16 2xl:mb-30">
      <Heading>내 체험 수정</Heading>
      <Suspense fallback={<ActivityFormSkeleton />}>
        <ActivityEditForm activityId={activityId} />
      </Suspense>
    </div>
  );
}
