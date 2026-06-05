import { cache } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ActivityDetailPageClient } from '@/app/(main)/activity/[id]/components/activity-detail-page-client';
import { ApiError } from '@/shared/apis/apiError';
import { User } from '@/shared/apis/auth/auth.types';
import { fetchInstanceServer } from '@/shared/apis/fetchInstance.server';
import { ActivityDetailResponse } from '@/shared/types/activityDetail.types';

interface ActivityDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * activityId로 체험 상세 정보 조회
 */
const getActivityDetail = cache(async (activityId: number) => {
  return fetchInstanceServer<ActivityDetailResponse>(
    `/activities/${activityId}`
  );
});

/**
 * 체험 상세 페이지 메타데이터를 동적으로 생성
 */
export const generateMetadata = async ({
  params,
}: ActivityDetailPageProps): Promise<Metadata> => {
  const { id } = await params;
  const activityId = Number(id);

  if (!Number.isFinite(activityId)) {
    return { title: '체험 상세' };
  }

  try {
    const activity = await getActivityDetail(activityId);
    const description =
      activity.description?.trim().slice(0, 140) ||
      `${activity.category} 체험을 확인해보세요.`;
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || 'https://globalnomad-team2.vercel.app';
    const pageUrl = new URL(`/activity/${activity.id}`, baseUrl).toString();
    const ogImageUrl =
      activity.bannerImageUrl?.trim() &&
      (activity.bannerImageUrl.startsWith('http://') ||
        activity.bannerImageUrl.startsWith('https://'))
        ? activity.bannerImageUrl
        : new URL(
            activity.bannerImageUrl || '/og-image.png',
            baseUrl
          ).toString();

    return {
      title: activity.title,
      description,
      openGraph: {
        title: activity.title,
        description,
        url: pageUrl,
        images: [
          {
            url: ogImageUrl,
            alt: `${activity.title} 대표 이미지`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: activity.title,
        description,
        images: [ogImageUrl],
      },
    };
  } catch {
    return { title: '체험 상세' };
  }
};

/**
 * 체험 상세 페이지 서버 엔트리 포인트
 *
 * URL 파라미터를 기반으로 상세 데이터를 조회,
 * 로그인 사용자와 작성자 id를 비교해 소유자 여부 계산 후
 * 클라이언트 컴포넌트에 전달
 */
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
    activity = await getActivityDetail(activityId);
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
  const isAuthenticated = currentUserId !== null;

  return (
    <ActivityDetailPageClient
      activity={activity}
      isOwner={isOwner}
      isAuthenticated={isAuthenticated}
    />
  );
}
