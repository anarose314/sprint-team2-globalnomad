'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
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
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1f1f22',
              margin: 0,
            }}
          >
            서버에 문제가 발생했어요
          </h1>
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
          <button
            onClick={reset}
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              backgroundColor: '#70acde',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.75rem',
              padding: '0.75rem 2rem',
              cursor: 'pointer',
            }}
          >
            다시 시도
          </button>
          <Link
            href="/"
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              backgroundColor: 'transparent',
              color: '#70acde',
              border: '1px solid #70acde',
              borderRadius: '0.75rem',
              padding: '0.75rem 2rem',
              textDecoration: 'none',
            }}
          >
            홈으로 이동
          </Link>
        </div>
      </body>
    </html>
  );
}
