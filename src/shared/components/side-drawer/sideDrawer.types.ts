import type { ReactNode } from 'react';

/**
 * sideDrawer 컴포넌트 props
 */
export interface SideDrawerProps {
  id?: string;
  children: ReactNode;
  onClose: () => void;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  ariaLabel?: string;
  overlayClassName?: string;
  panelClassName?: string;
}
