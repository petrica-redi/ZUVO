import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "./cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "elevated" | "gradient" | "outline";
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = "default", className, ...rest },
  ref,
) {
  const variantClass =
    variant === "elevated"
      ? "shadow-lg shadow-gray-900/5 ring-1 ring-gray-100"
      : variant === "gradient"
        ? "bg-gradient-to-br from-white to-gray-50 ring-1 ring-gray-100"
        : variant === "outline"
          ? "border-2 border-gray-200"
          : "ring-1 ring-gray-100 shadow-sm";

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-3xl bg-white",
        variantClass,
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
        className={cn("text-base font-black tracking-tight text-gray-900", className)}
        {...rest}
      />
    );
  },
);

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function CardDescription({ className, ...rest }, ref) {
    return (
      <p ref={ref} className={cn("text-sm leading-relaxed text-gray-500", className)} {...rest} />
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
        className={cn("flex items-center gap-2 border-t border-gray-100 p-5", className)}
        {...rest}
      />
    );
  },
);
