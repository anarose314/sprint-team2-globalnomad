'use client';

import { Toast } from '@/shared/components/toast';
import { useRemoveToast, useToasts } from '@/shared/store/useToastStore';
import { cn } from '@/shared/utils/cn';

export function ToastContainer() {
  const toasts = useToasts();
  const removeToast = useRemoveToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className={cn(
        'z-toast pointer-events-none fixed bottom-5 flex flex-col gap-2',
        'left-1/2 -translate-x-1/2 items-center',
        'md:top-5'
      )}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>
  );
}
