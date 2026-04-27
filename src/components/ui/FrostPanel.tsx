import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
};

const pad = { sm: "p-3.5", md: "p-4", lg: "p-5" } as const;

/**
 * Glass-morphism card — use for list rows, settings blocks, and stats.
 */
export function FrostPanel({ children, className = "", padding = "md" }: Props) {
  return (
    <div
      className={`rounded-2xl border border-white/60 bg-white/75 shadow-[0_2px_16px_rgba(15,23,42,0.04)] backdrop-blur-md ${pad[padding]} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
