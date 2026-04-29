import {
  IcToastError,
  IcToastInfo,
  IcToastSuccess,
  IcToastWarning,
} from '@/shared/assets/icons';

export const TOAST_ICONS = {
  success: {
    Icon: IcToastSuccess,
    colorClass: 'text-primary-500',
  },
  error: {
    Icon: IcToastError,
    colorClass: 'text-error',
  },
  warning: {
    Icon: IcToastWarning,
    colorClass: 'text-warning',
  },
  info: {
    Icon: IcToastInfo,
    colorClass: 'text-info',
  },
} as const;

export const DEFAULT_TITLES = {
  success: '성공',
  error: '오류 발생',
  warning: '주의',
  info: '안내',
} as const;

export const TOAST_DURATION = 3000;
export const MAX_TOASTS = 3;
