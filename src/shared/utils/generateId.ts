/**
 * 범용 고유 ID 생성 함수
 * @returns crypto.randomUUID() 기반 UUID 문자열, 미지원 환경에서는 랜덤 문자열
 */
export const generateId = () => {
  return (
    globalThis.crypto?.randomUUID?.() ??
    Math.random().toString(36).substring(2, 11)
  );
};
