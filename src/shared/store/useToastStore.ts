import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { MAX_TOASTS } from '@/shared/components/toast/toast.constants';
import { ToastProps } from '@/shared/components/toast/toast.types';

type ToastData = Omit<ToastProps, 'onClose'>;

const useToastStore = create(
  immer(
    combine({ toasts: [] as ToastData[] }, (set) => ({
      actions: {
        showToast: (params: Omit<ToastData, 'id'>) => {
          const id =
            typeof crypto !== 'undefined' && crypto.randomUUID
              ? crypto.randomUUID()
              : Math.random().toString(36).substring(2, 11);
          const newToast = {
            ...params,
            id,
          };
          set((state) => {
            state.toasts.push(newToast);
            if (state.toasts.length > MAX_TOASTS) {
              state.toasts.shift();
            }
          });
        },
        removeToast: (id: string) => {
          set((state) => {
            state.toasts = state.toasts.filter((toast) => toast.id !== id);
          });
        },
      },
    }))
  )
);

/** 토스트 목록 조회 */
export const useToasts = () => {
  const toasts = useToastStore((store) => store.toasts);
  return toasts;
};

/**
 * 토스트 호출하는 커스텀 훅
 *
 * @example
 * ```tsx
 * import { useShowToast } from '@/shared/store/useToastStore';
 *
 * const showToast = useShowToast();
 *
 * const handleClick = () => {
 * showToast({
 * theme: 'success',
 * message: '요청하신 작업이 정상적으로 처리되었습니다.',
 * });
 * };
 * ```
 */
export const useShowToast = () => {
  const showToast = useToastStore((store) => store.actions.showToast);
  return showToast;
};

/** 특정 토스트 삭제 */
export const useRemoveToast = () => {
  const removeToast = useToastStore((store) => store.actions.removeToast);
  return removeToast;
};
