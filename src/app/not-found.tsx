'use client';

import Link from 'next/link';
import LogoIcon from '@/shared/assets/logos/logo-vertical.svg';
import { Button } from '@/shared/components/buttons';
import { Heading } from '@/shared/components/heading';

export default function NotFound() {
  return (
    <div className="bg-gray-25 flex min-h-screen flex-col items-center justify-center px-6 pb-26">
      <Link href="/" className="mb-7" aria-label="홈으로 이동">
        <LogoIcon width={120} height={120} />
      </Link>

      <div className="flex flex-col items-center gap-6 text-center">
        <p className="typo-3xl-bold text-primary-500">404</p>

        <div className="flex flex-col gap-2">
          <Heading as="h2" textStyle="typo-2xl-bold">
            페이지를 찾을 수 없어요
          </Heading>
          <p className="typo-lg-regular text-gray-500">
            요청하신 페이지가 존재하지 않거나 이동되었습니다.
          </p>
        </div>

        <Button as={Link} href="/" variant="secondary" size="md">
          홈으로 돌아가기
        </Button>
      </div>
    </div>
  );
}
