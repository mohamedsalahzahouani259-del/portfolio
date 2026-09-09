import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// Global event bus for toast messages
type ToastListener = (toast: ToastMessage) => void;
const listeners: ToastListener[] = [];

export const toast = {
  success: (message: string, duration = 4000) => {
    emit({ id: Math.random().toString(), type: 'success', message, duration });
  },
  error: (message: string, duration = 5000) => {
    emit({ id: Math.random().toString(), type: 'error', message, duration });
  },
  info: (message: string, duration = 4000) => {
    emit({ id: Math.random().toString(), type: 'info', message, duration });
  },
};

function emit(msg: ToastMessage) {
  listeners.forEach((fn) => fn(msg));
}

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler: ToastListener = (t) => {
      setToasts((prev) => [...prev, t]);
      if (t.duration && t.duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((item) => item.id !== t.id));
        }, t.duration);
      }
    };
    listeners.push(handler);
    return () => {
      const idx = listeners.indexOf(handler);
      if (idx >= 0) listeners.splice(idx, 1);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const icon =
          t.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : t.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-brand-500 shrink-0" />
          );

        const borderColor =
          t.type === 'success'
            ? 'border-emerald-200 bg-emerald-50/90 text-emerald-900'
            : t.type === 'error'
            ? 'border-rose-200 bg-rose-50/90 text-rose-900'
            : 'border-brand-200 bg-brand-50/90 text-brand-900';

        return (
          <div
            key={t.id}
            className={clsx(
              'pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 duration-200',
              borderColor
            )}
          >
            <div className="flex items-center gap-3">
              {icon}
              <p className="text-sm font-medium">{t.message}</p>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
              className="p-1 rounded-md hover:bg-black/5 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
