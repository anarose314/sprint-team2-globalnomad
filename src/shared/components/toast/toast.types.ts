export type ToastTheme = 'success' | 'error' | 'warning' | 'info';

export type ToastProps = {
  id: string;
  theme?: ToastTheme;
  title?: string;
  message?: string;
  isDisableTitle?: boolean;
  onClose: (id: string) => void;
};
