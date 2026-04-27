import type { ReactNode } from "react";

/**
 * Standard full-height column for all main screens (shell background comes from .mobile-shell).
 */
export function AppShell({ children }: { children: ReactNode }) {
  return <div className="flex min-h-[100dvh] flex-col">{children}</div>;
}

type MainProps = {
  children: ReactNode;
  className?: string;
  /** Use when child must shrink for inner scroll (e.g. chat) */
  noFlexGrow?: boolean;
};

export function ScreenMain({ children, className = "", noFlexGrow = false }: MainProps) {
  return (
    <main
      id="main-content"
      className={`min-h-0 ${noFlexGrow ? "" : "flex-1"} pb-2 ${className}`.trim()}
    >
      {children}
    </main>
  );
}
