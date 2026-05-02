import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "./cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "elevated" | "gradient" | "outline" | "interactive" | "glass";
  /** Apply a subtle grain overlay (kills banding on gradient variants). */
  grain?: boolean;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = "default", grain, className, ...rest },
  ref,
) {
  const variantClass =
    variant === "elevated"
      ? "bg-[var(--color-surface)] hairline shadow-3"
      : variant === "gradient"
        ? "bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-subtle)] hairline shadow-2"
        : variant === "outline"
          ? "bg-[var(--color-surface)] border-2 border-[var(--color-border-default)]"
          : variant === "interactive"
            ? "bg-[var(--color-surface)] card-interactive shadow-1"
            : variant === "glass"
              ? "glass-surface"
              : "bg-[var(--color-surface)] hairline shadow-1";

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-3xl",
        variantClass,
        grain && "grain-overlay",
        className,
      )}
      {...rest}
    />
  );
});

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardHeader({ className, ...rest }, ref) {
    return <div ref={ref} className={cn("flex flex-col gap-1 p-5", className)} {...rest} />;
  },
);

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  function CardTitle({ className, ...rest }, ref) {
    return (
      <h3
        ref={ref}
        className={cn(
          "font-display text-base font-extrabold tracking-tight text-[var(--color-text-primary)]",
          className,
        )}
        style={{ letterSpacing: "-0.015em" }}
        {...rest}
      />
    );
  },
);

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function CardDescription({ className, ...rest }, ref) {
    return (
      <p
        ref={ref}
        className={cn("text-sm leading-relaxed text-[var(--color-text-secondary)]", className)}
        {...rest}
      />
    );
  },
);

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardContent({ className, ...rest }, ref) {
    return <div ref={ref} className={cn("p-5 pt-0", className)} {...rest} />;
  },
);

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 border-t border-[var(--color-border-subtle)] p-5",
          className,
        )}
        {...rest}
      />
    );
  },
);
