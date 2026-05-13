import { useEffect, useState } from 'react';

/**
 * 현재 시각 타임스탬프를 주기적으로 갱신하는 훅
 */
export const useCurrentTimestamp = (isOpen: boolean) => {
  const [nowTimestamp, setNowTimestamp] = useState(() => Date.now());

  useEffect(() => {
    if (!isOpen) return;

    const intervalId = window.setInterval(() => {
      setNowTimestamp(Date.now());
    }, 60_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isOpen]);

  return nowTimestamp;
};
