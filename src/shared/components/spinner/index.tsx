/**
 * 전역 공통 로딩 스피너 컴포넌트.
 * Tailwind CSS의 animate-spin 클래스를 사용하여 회전 애니메이션을 구현한다.
 * * @example
 * ```ts
 * <Spinner className="w-8 h-8" />
 * ```
 */
export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={`h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent text-gray-400 ${className}`}
      role="status"
      aria-label="loading"
    />
  );
}
