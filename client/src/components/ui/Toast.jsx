// src/components/ui/Toast.jsx
import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { ToastContext } from "./toastContext.js";

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const STYLES = {
  success: "border-emerald-200 bg-white text-emerald-700",
  error: "border-red-200 bg-white text-red-700",
  info: "border-blue-200 bg-white text-blue-700",
};

const ICON_COLORS = {
  success: "text-emerald-500",
  error: "text-red-500",
  info: "text-blue-500",
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback(
    (type, message) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => remove(id), 4200);
    },
    [remove]
  );

  const value = useMemo(
    () => ({
      success: (message) => add("success", message),
      error: (message) => add("error", message),
      info: (message) => add("info", message),
    }),
    [add]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = ICONS[toast.type] || Info;
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, x: 60, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg shadow-gray-900/5 ${STYLES[toast.type] || STYLES.info}`}
                role="status"
              >
                <Icon size={18} className={`mt-0.5 shrink-0 ${ICON_COLORS[toast.type] || ICON_COLORS.info}`} />
                <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
                <button
                  onClick={() => remove(toast.id)}
                  className="shrink-0 text-gray-400 transition-colors hover:text-gray-600"
                  aria-label="Dismiss notification"
                >
                  <XCircle size={16} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};