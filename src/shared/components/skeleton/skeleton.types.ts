import { CSSProperties, HTMLAttributes } from 'react';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * 스켈레톤 너비
   * 숫자는 `px`, 문자열은 모든 CSS 단위 지원
   * @example width={48} // 48px
   * @example width="100%" // 부모 너비에 맞춤
   */
  width?: CSSProperties['width'];
  /**
   * 스켈레톤 높이
   * 숫자는 `px`, 문자열은 모든 CSS 단위를 지원
   * @example height={20} // 20px
   * @example height="1.5rem"
   */
  height?: CSSProperties['height'];
  /**
   * 모서리 둥글기
   * Tailwind `rounded-*` 단계와 동일
   * @default "md"
   */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /**
   * 로딩 애니메이션 종류
   * - `pulse`: 밝기가 반복적으로 변하는 페이드 애니메이션 (기본값)
   * - `shimmer`: 좌→우로 빛이 흐르는 슬라이딩 그라디언트 애니메이션
   * - `none`: 애니메이션 없음
   * @default "pulse"
   */
  variant?: 'pulse' | 'shimmer' | 'none';
  /**
   * `true`이면 부모 컨테이너의 너비를 100% 채움 (`w-full`)
   * `width` prop과 함께 사용할 경우 `fullWidth`가 우선 적용
   * @default false
   */
  fullWidth?: boolean;
}
