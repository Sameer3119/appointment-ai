import React from "react";
import { CheckCircle2, AlertCircle, Info, XCircle, X } from "lucide-react";
import { useApp } from "../../context/AppContext";

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <aside aria-label="Notifications" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";
        const isWarning = toast.type === "warning";

        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-white rounded-xl border border-charcoal-200 shadow-modal p-4 flex items-start gap-3 transition-all transform animate-slideInRight"
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {isError && <XCircle className="w-5 h-5 text-rose-600" />}
              {isWarning && <AlertCircle className="w-5 h-5 text-amber-600" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-brand-700" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-charcoal-900">{toast.title}</h4>
              {toast.message && (
                <p className="text-xs text-charcoal-600 mt-0.5 line-clamp-2 leading-relaxed">{toast.message}</p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 rounded-md text-charcoal-400 hover:text-charcoal-600 hover:bg-charcoal-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </aside>
  );
}
