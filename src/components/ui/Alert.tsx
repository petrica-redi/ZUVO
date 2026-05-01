import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

type Variant = "info" | "success" | "warning" | "danger" | "neutral";

type Props = HTMLAttributes<HTMLDivElement> & {
  variant?: Variant;
  icon?: ReactNode;
};

const VARIANT: Record<Variant, string> = {
  info: "border-sky-200 bg-sky-50/80 text-sky-900",
  success: "border-emerald-200 bg-emerald-50/80 text-emerald-900",
  warning: "border-amber-200 bg-amber-50/80 text-amber-900",
  danger: "border-rose-200 bg-rose-50/80 text-rose-900",
  neutral: "border-gray-200 bg-gray-50/80 text-gray-900",
};

export function Alert({ variant = "info", icon, className, children, ...rest }: Props) {
  return (
    <div
      role="status"
      className={cn("flex items-start gap-3 rounded-2xl border p-4 text-sm", VARIANT[variant], className)}
      {...rest}
    >
      {icon && <span aria-hidden className="mt-0.5 flex-shrink-0">{icon}</span>}
      <div className="flex-1 leading-relaxed">{children}</div>
    </div>
  );
}

export function AlertTitle({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-0.5 font-black", className)} {...rest} />;
}

export function AlertDescription({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm leading-relaxed opacity-90", className)} {...rest} />;
}
