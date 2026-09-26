import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    (message: string, type: ToastType = 'success') => {
      const id = Math.random().toString(36).slice(2);

      setToasts((prev) => [...prev, { id, type, message }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] flex flex-col gap-3 w-[calc(100%-2rem)] max-w-md">
        {toasts.map((t) => (
          <div
  key={t.id}
  className="flex items-start gap-4 rounded-xl bg-white shadow-card border border-cream-200 p-5 animate-fade-in-scale max-w-lg w-full"
>
            {t.type === 'success' && (
              <CheckCircle className="w-6 h-6  text-green-600 shrink-0 mt-0.5" />
            )}

            {t.type === 'error' && (
              <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
            )}

            {t.type === 'info' && (
              <Info className="w-6 h-6 text-saffron-600 shrink-0 mt-0.5" />
            )}

            <p className="text-base text-neutral-700 flex-1 leading-relaxed">
              {t.message}
            </p>

            <button
              onClick={() => dismiss(t.id)}
              className="text-neutral-400 hover:text-neutral-600 shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);

  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return ctx;
}