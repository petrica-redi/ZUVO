import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "premium" | "muted";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  size?: "sm" | "md";
};

const VARIANT: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-700 ring-gray-200",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  danger: "bg-rose-50 text-rose-700 ring-rose-200",
  info: "bg-sky-50 text-sky-700 ring-sky-200",
  premium:
    "bg-gradient-to-r from-amber-100 via-yellow-100 to-orange-100 text-amber-800 ring-amber-200",
  muted: "bg-gray-50 text-gray-400 ring-gray-100",
};

export function Badge({ variant = "default", size = "md", className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-bold uppercase tracking-wider ring-1",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-[11px]",
        VARIANT[variant],
        className,
      )}
      {...rest}
    />
  );
}
