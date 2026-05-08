'use client';

import Link from 'next/link';
import { Button } from '@/shared/components/buttons';

export function ActivityButton() {
  return (
    <Button as={Link} href="/activity/add" className="w-full">
      체험 등록하기
    </Button>
  );
}
