'use client';

import { useEffect } from 'react';

/**
 * BFCache(Back-Forward Cache) 복원 감지 후 강제 새로고침.
 *
 * 브라우저는 페이지 이동 시 이전 페이지를 메모리에 캐시했다가,
 * 뒤로가기 시 서버 요청 없이 즉시 복원한다. 이 경우 layout의
 * 인증 가드가 다시 실행되지 않아 로그아웃 후에도 보호 페이지가
 * 보일 수 있다.
 *
 * pageshow의 event.persisted가 true면 BFCache에서 복원된 것이므로,
 * 강제 reload로 서버 요청을 발생시켜 layout 가드가 다시 동작하게 한다.
 *
 * 보호 영역(my/) 안에서만 사용한다.
 */
export function BFCacheGuard() {
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  return null;
}
