'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/components/buttons';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }
  }, [error]);

  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f8f8',
          fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
          padding: '1.5rem',
          textAlign: 'center',
          gap: '1.5rem',
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="GlobalNomad 로고"
        >
          <path
            d="M40 80C62.0914 80 80 62.0914 80 40C80 17.9086 62.0914 0 40 0C17.9086 0 0 17.9086 0 40C0 62.0914 17.9086 80 40 80Z"
            fill="#70ACDE"
          />
          <path
            d="M51.8389 40.8609L47.9333 42.1998L46.1111 38.2832L28.1389 27.0609L20.3333 25.7109L0.466667 33.8832C0.161111 35.8776 0 37.922 0 39.9998C0 61.3998 16.8111 78.8776 37.9444 79.9498L74.3722 33.5609L51.8389 40.8609Z"
            fill="#4B91C9"
          />
          <path
            d="M73.9055 30.7224C72.6833 27.9835 69.4777 26.7502 66.7389 27.9724L58.1055 31.8168L27.9055 22.2946C27.5277 22.178 27.1166 22.2113 26.7611 22.3946L20.3333 25.7113C19.7 26.0391 19.6944 26.9446 20.3222 27.2835L42.1277 38.9279L27.7555 45.3335L9.67219 38.8557C9.33886 38.7391 8.91664 38.7724 8.49441 38.9557L3.71664 41.6779C2.95553 42.0057 2.61108 42.9113 3.11108 43.2502L22.0111 56.6279L22.0222 56.6224C22.9722 57.3613 24.1444 57.7779 25.3555 57.7779C26.0944 57.7779 26.8444 57.628 27.5611 57.3057L71.15 37.8946C73.8944 36.6724 75.1222 33.4668 73.9055 30.7224Z"
            fill="#F8FBFE"
          />
        </svg>

        <p
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#f96767',
            margin: 0,
          }}
        >
          500
        </p>

        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1f1f22',
              margin: 0,
            }}
          >
            서버에 문제가 발생했어요
          </h2>
          <p
            style={{
              fontSize: '1rem',
              fontWeight: 400,
              color: '#84858c',
              margin: 0,
            }}
          >
            일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <Button size="md" onClick={reset}>
            다시 시도
          </Button>
          <Button as={Link} href="/" variant="secondary" size="md">
            홈으로 이동
          </Button>
        </div>
      </body>
    </html>
  );
}
