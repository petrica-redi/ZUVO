"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "./cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
};

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.97]",
  secondary:
    "bg-white text-gray-900 ring-1 ring-gray-200 shadow-sm hover:shadow-md active:scale-[0.97]",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100 active:scale-[0.97]",
  outline:
    "border-2 border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.97]",
  danger:
    "bg-gradient-to-br from-rose-600 to-red-600 text-white shadow-md shadow-rose-500/20 hover:shadow-lg active:scale-[0.97]",
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
        "inline-flex items-center justify-center gap-2 rounded-2xl font-bold transition-all",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
        VARIANT[variant],
        SIZE[size],
        fullWidth ? "w-full" : "",
        className,
      )}
      {...rest}
    >
      {loading ? (
        <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
      ) : null}
      {children}
    </button>
  );
});
