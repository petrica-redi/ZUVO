"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "./cn";

export type ToastVariant = "info" | "success" | "warning" | "danger";

type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
};

type ToastInput = Omit<Partial<Toast>, "id"> & { description?: string };

type ToastContextValue = {
  show: (toast: ToastInput) => void;
  success: (description: string, title?: string) => void;
  info: (description: string, title?: string) => void;
  warning: (description: string, title?: string) => void;
  danger: (description: string, title?: string) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastVariant, ReactNode> = {
  info: <Info className="lucide h-5 w-5 text-[var(--color-info-accent)]" strokeWidth={1.75} />,
  success: <CheckCircle2 className="lucide h-5 w-5 text-[var(--color-success-accent)]" strokeWidth={1.75} />,
  warning: <AlertTriangle className="lucide h-5 w-5 text-[var(--color-warning-accent)]" strokeWidth={1.75} />,
  danger: <XCircle className="lucide h-5 w-5 text-[var(--color-danger-accent)]" strokeWidth={1.75} />,
};

const VARIANT_RING: Record<ToastVariant, string> = {
  info: "ring-[var(--color-info-border)]",
  success: "ring-[var(--color-success-border)]",
  warning: "ring-[var(--color-warning-border)]",
  danger: "ring-[var(--color-danger-border)]",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const tCommon = useTranslations("common");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    const t = timers.current.get(id);
    if (t) {
      clearTimeout(t);
      timers.current.delete(id);
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (input: ToastInput) => {
      const id = (typeof crypto !== "undefined" && "randomUUID" in crypto)
        ? crypto.randomUUID()
        : `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const variant = input.variant ?? "info";
      const duration = input.duration ?? 4500;
      const toast: Toast = {
        id,
        title: input.title,
        description: input.description,
        variant,
        duration,
      };
      setToasts((prev) => [...prev, toast]);
      if (duration > 0) {
        const handle = setTimeout(() => dismiss(id), duration);
        timers.current.set(id, handle);
      }
    },
    [dismiss],
  );

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      timers.current.clear();
    },
    [],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      show,
      success: (description, title) => show({ description, title, variant: "success" }),
      info: (description, title) => show({ description, title, variant: "info" }),
      warning: (description, title) => show({ description, title, variant: "warning" }),
      danger: (description, title) => show({ description, title, variant: "danger" }),
      dismiss,
    }),
    [show, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 top-4 z-[120] flex flex-col items-center gap-2 px-4 sm:top-6"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={cn(
              "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl glass-surface p-3 ring-1 animate-fade-in-up",
              VARIANT_RING[toast.variant],
            )}
          >
            <span aria-hidden className="mt-0.5">{ICONS[toast.variant]}</span>
            <div className="flex-1 text-sm">
              {toast.title && (
                <div className="font-extrabold text-[var(--color-text-primary)]">
                  {toast.title}
                </div>
              )}
              {toast.description && (
                <div className="leading-relaxed text-[var(--color-text-secondary)]">
                  {toast.description}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="rounded-full p-1 text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
              aria-label={tCommon("dismiss")}
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      show: () => {},
      success: () => {},
      info: () => {},
      warning: () => {},
      danger: () => {},
      dismiss: () => {},
    };
  }
  return ctx;
}
