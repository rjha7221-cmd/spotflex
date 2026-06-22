import React from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

import { useNotifications } from "../context/NotificationContext";

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

function ToastHost() {
  const { toasts, dismissToast } = useNotifications();

  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || Info;

        return (
          <div key={toast.id} className={`toast-card toast-${toast.type}`}>
            <Icon size={19} />
            <div>
              <strong>{toast.title}</strong>
              {toast.message && <p>{toast.message}</p>}
            </div>
            <button
              type="button"
              className="toast-close"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              title="Dismiss"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ToastHost;
