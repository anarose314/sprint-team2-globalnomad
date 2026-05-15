'use client';

import Link from 'next/link';
import { MyPageEmptyProps } from '@/app/(main)/my/components/my-page-empty/myPageEmpty.types';
import { IcEmpty } from '@/shared/assets/icons';
import { Button } from '@/shared/components/buttons';

export function MyPageEmpty({ message, buttonLabel, href }: MyPageEmptyProps) {
  return (
    <div className="flex w-full flex-col items-center">
      <IcEmpty className="h-32 w-32" />
      <p className="typo-2lg-medium text-gray-600">{message}</p>
      <Button as={Link} href={href} size="lg" className="mt-7.5 w-45.5">
        {buttonLabel}
      </Button>
    </div>
  );
}
