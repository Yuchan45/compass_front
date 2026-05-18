import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { Toast, type ToastMode } from '@/components/toast';

type ToastOptions = {
  durationMs?: number;
  message: string;
  mode: ToastMode;
};

type ActiveToast = ToastOptions & {
  id: number;
};

type ToastContextValue = {
  hideToast: () => void;
  showToast: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

type ToastProviderProps = {
  children: ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [activeToast, setActiveToast] = useState<ActiveToast | null>(null);

  const hideToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  const showToast = useCallback((options: ToastOptions) => {
    setActiveToast({
      ...options,
      id: Date.now(),
    });
  }, []);

  const value = useMemo(
    () => ({
      hideToast,
      showToast,
    }),
    [hideToast, showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {activeToast ? (
        <Toast
          key={activeToast.id}
          durationMs={activeToast.durationMs}
          message={activeToast.message}
          mode={activeToast.mode}
          onDismiss={hideToast}
        />
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider.');
  }

  return context;
}
