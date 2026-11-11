"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconCheck, IconLoader2, IconAlertCircle, IconInbox } from "@tabler/icons-react";

type ToastType = "success" | "error" | "info" | "loading";

type Toast = {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
};

type ToastContextType = {
  toast: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
  toasts: Toast[];
};

const ToastContext = createContext<ToastContextType | null>(null);

let toasts: Toast[] = [];
let listeners: Array<(toasts: Toast[]) => void> = [];

function emit() {
  for (const fn of listeners) fn([...toasts]);
}

function addToast(t: Omit<Toast, "id">): string {
  const id = Math.random().toString(36).slice(2, 9);
  const newToast: Toast = { id, duration: 4000, ...t };
  toasts = [newToast, ...toasts];
  emit();
  if (newToast.type !== "loading" && newToast.duration! > 0) {
    setTimeout(() => {
      dismissToast(newToast.id);
    }, newToast.duration);
  }
  return id;
}

function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}

export { ToastContext, useToast };

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toastList, setToastList] = useState<Toast[]>(toasts);

  useCallback(() => {
    const unsub = listen(setToastList);
    return unsub;
  }, []);

  const toast = useCallback((t: Omit<Toast, "id">) => addToast(t), []);
  const dismiss = useCallback((id: string) => dismissToast(id), []);

  return (
    <ToastContext.Provider value={{ toast, dismiss, toasts: toastList }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

function listen(fn: (toasts: Toast[]) => void) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((f) => f !== fn);
  };
}

const ICON_MAP: Record<ToastType, React.ReactNode> = {
  success: <IconCheck size={18} className="text-emerald-600 dark:text-emerald-400" />,
  error: <IconAlertCircle size={18} className="text-red-600 dark:text-red-400" />,
  info: <IconInbox size={18} className="text-blue-600 dark:text-blue-400" />,
  loading: <IconLoader2 size={18} className="text-neutral-600 dark:text-neutral-400 animate-spin" />,
};

function ToastItem({ toast }: { toast: Toast }) {
  const [isRemoving, setIsRemoving] = useState(false);

  useCallback(() => {
    if (toast.type === "loading") return;
    const t = setTimeout(() => setIsRemoving(true), toast.duration! - 300);
    return () => clearTimeout(t);
  }, [toast.id, toast.duration]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`flex items-start gap-3 rounded-lg border p-4 shadow-lg min-w-[300px] max-w-[420px] ${
        toast.type === "success"
          ? "bg-emerald-50 dark:bg-emerald-900/50 border-emerald-200 dark:border-emerald-700"
          : toast.type === "error"
          ? "bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-700"
          : toast.type === "loading"
          ? "bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700"
          : "bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700"
      } ${isRemoving ? "opacity-0" : "opacity-100"}`}
    >
      <div className="mt-0.5 shrink-0">{ICON_MAP[toast.type]}</div>
      <div className="flex-1">
        <h4 className="font-display font-semibold text-sm text-neutral-900 dark:text-neutral-100">
          {toast.title}
        </h4>
        {toast.description && (
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
            {toast.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function ToastContainer() {
  const { toasts } = useToast();
  return (
    <AnimatePresence>
      {toasts.map((t) => (
        <motion.div
          key={t.id}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <ToastItem toast={t} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
