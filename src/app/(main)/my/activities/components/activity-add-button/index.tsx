'use client';

import Link from 'next/link';
import { useMyActivitiesInfinite } from '@/app/(main)/my/activities/hooks/useMyActivitiesInfinite';
import { Button } from '@/shared/components/buttons';

export function ActivityAddButton() {
  const { data } = useMyActivitiesInfinite();
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  if (totalCount === 0) return null;
  return (
    <Button as={Link} href="/activity/add" className="w-full">
      체험 등록하기
    </Button>
  );
}
