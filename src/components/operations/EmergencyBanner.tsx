import { AlertTriangle, Phone } from "lucide-react";

export function EmergencyBanner({
  message,
  callLabel,
  variant = "danger",
  className = "",
}: {
  message: string;
  callLabel: string;
  variant?: "danger" | "warning";
  className?: string;
}) {
  const isDanger = variant === "danger";

  return (
    <div
      role="alert"
      className={`flex flex-col gap-3 rounded-2xl border p-4 shadow-1 sm:flex-row sm:items-center sm:justify-between ${
        isDanger
          ? "border-[var(--color-danger-border)] bg-[var(--color-danger-bg)]"
          : "border-[var(--color-warning-border)] bg-[var(--color-warning-bg)]"
      } ${className}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isDanger
              ? "bg-[var(--color-danger-accent)]/15 text-[var(--color-danger-text)]"
              : "bg-[var(--color-warning-accent)]/15 text-[var(--color-warning-text)]"
          }`}
        >
          <AlertTriangle className="h-5 w-5" aria-hidden />
        </span>
        <p
          className={`text-sm font-medium leading-relaxed ${
            isDanger
              ? "text-[var(--color-danger-text)]"
              : "text-[var(--color-warning-text)]"
          }`}
        >
          {message}
        </p>
      </div>
      <a
        href="tel:112"
        className={`inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-extrabold text-white shadow-1 transition-transform active:scale-[0.98] ${
          isDanger
            ? "bg-[var(--color-danger-accent)] hover:opacity-95"
            : "bg-[var(--color-warning-accent)] hover:opacity-95"
        }`}
      >
        <Phone className="h-4 w-4" aria-hidden />
        {callLabel}
      </a>
    </div>
  );
}
