import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotification();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border text-sm font-medium transition-all transform translate-y-0 ${
              isSuccess
                ? 'bg-emerald-900 text-white border-emerald-700 shadow-emerald-950/20'
                : isError
                ? 'bg-rose-900 text-white border-rose-700 shadow-rose-950/20'
                : 'bg-slate-900 text-white border-slate-700 shadow-slate-950/20'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {isError && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {!isSuccess && !isError && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5 text-white/70" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
