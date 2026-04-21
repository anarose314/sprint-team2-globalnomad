/**
 * 사이드바에 표시되는 메뉴 항목의 타입
 */
import type { ComponentType, SVGProps } from 'react';

export type MenuItem = {
  href: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

/**
 * 사이드바 컴포넌트의 Props
 */
export type SidebarProps = {
  /** 프로필 이미지 URL. 없으면 기본 아이콘이 표시된다. */
  profileImageUrl?: string;
};
