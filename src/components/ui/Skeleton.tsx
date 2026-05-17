import { cn } from "./cn";

type Props = {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "xl" | "full";
};

const ROUND: Record<NonNullable<Props["rounded"]>, string> = {
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-xl",
  xl: "rounded-2xl",
  full: "rounded-full",
};

export function Skeleton({ className, rounded = "md" }: Props) {
  return (
    <div
      aria-hidden
      className={cn("animate-shimmer", ROUND[rounded], className)}
    />
  );
}
