/**
 * 사이드바에 표시되는 메뉴 항목의 타입
 */
import type { ComponentType, SVGProps } from 'react';

export type MenuItem = {
  href: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};
