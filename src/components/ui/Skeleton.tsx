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
      className={cn(
        "animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100",
        ROUND[rounded],
        className,
      )}
    />
  );
}
