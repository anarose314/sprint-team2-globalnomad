import { ActivityDetailSkeleton } from '@/app/(main)/activity/[id]/components/activity-detail-skeleton';

/**
 * 체험 상세 라우트 세그먼트 로딩 UI
 *
 * 서버에서 상세·유저 정보를 가져오는 동안 `Suspense` 경계에 표시된다.
 */
export default function ActivityDetailLoading() {
  return <ActivityDetailSkeleton />;
}
