import type { ComponentType, SVGProps } from 'react';

/**
 * 사이드바에 표시되는 메뉴 항목의 타입
 */
export type MenuItem = {
  href: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export type SidebarVariant = 'desktop' | 'drawer';

export interface SidebarProps {
  variant?: SidebarVariant;
  onNavigate?: () => void;
  onLogout?: () => void;
}
