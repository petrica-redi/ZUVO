"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "./cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "danger"
  | "ember";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
};

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    "gradient-brand grain-overlay text-white shadow-brand hover:brightness-105 active:scale-[0.97] active:brightness-95",
  secondary:
    "bg-[var(--color-surface)] text-[var(--color-text-primary)] hairline shadow-1 hover:shadow-2 hover:bg-[var(--color-surface-hover)] active:scale-[0.97]",
  ghost:
    "bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] active:scale-[0.97]",
  outline:
    "border-2 border-[var(--color-border-default)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-hover)] active:scale-[0.97]",
  danger:
    "gradient-emergency grain-overlay text-white shadow-danger hover:brightness-105 active:scale-[0.97]",
  ember:
    "gradient-ember grain-overlay text-white shadow-ember hover:brightness-105 active:scale-[0.97]",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-sm",
  xl: "h-14 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading, fullWidth, disabled, className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-bold transition-all duration-200",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-canvas)]",
        VARIANT[variant],
        SIZE[size],
        fullWidth ? "w-full" : "",
        className,
      )}
      style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
      {...rest}
    >
      {loading ? (
        <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
      ) : null}
      {children}
    </button>
  );
});
