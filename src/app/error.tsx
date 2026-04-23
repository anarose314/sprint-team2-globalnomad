'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import LogoIcon from '@/shared/assets/logos/logo-icon.svg';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-gray-25 flex min-h-screen flex-col items-center justify-center px-6">
      <Link href="/" className="mb-12" aria-label="홈으로 이동">
        <LogoIcon width={72} height={72} />
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
          <button
            onClick={reset}
            className="typo-lg-semibold bg-primary-500 hover:bg-primary-600 active:bg-primary-700 rounded-xl px-8 py-3 text-white transition-colors"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="typo-lg-semibold border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100 rounded-xl border px-8 py-3 transition-colors"
          >
            홈으로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}
