'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import LogoIcon from '@/shared/assets/logos/logo-vertical.svg';
import { Button } from '@/shared/components/buttons';
import { BUTTON_VARIANTS } from '@/shared/components/buttons/button/button.constants';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-gray-25 flex min-h-screen flex-col items-center justify-center px-6 pb-32">
      <Link href="/" className="mb-7" aria-label="홈으로 이동">
        <LogoIcon width={120} height={120} />
      </Link>

      <div className="flex flex-col items-center gap-6 text-center">
        <p className="typo-3xl-bold text-red-500">500</p>

        <div className="flex flex-col gap-2">
          <h1 className="typo-2xl-bold text-gray-950">
            서버에 문제가 발생했어요
          </h1>
          <p className="typo-lg-regular text-gray-500">
            일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        </div>

        <div className="mt-4 flex gap-3">
          <Button size="md" onClick={reset}>
            다시 시도
          </Button>
          <Link
            href="/"
            className={BUTTON_VARIANTS({ variant: 'secondary', size: 'md' })}
          >
            홈으로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}
