"use client";

import { Link, usePathname } from "@/navigation";
import { Home, FileText, MessageCircle, Users, LayoutGrid } from "lucide-react";

const TABS = [
  { key: "home", href: "/", Icon: Home, label: "Home" },
  { key: "explain", href: "/explain", Icon: FileText, label: "Explain" },
  { key: "chat", href: "/chat", Icon: MessageCircle, label: "Ask", isPrimary: true },
  { key: "family", href: "/family", Icon: Users, label: "Family" },
  { key: "more", href: "/more", Icon: LayoutGrid, label: "More" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const cleanPath = pathname.replace(/^\/[a-z]{2,3}(?=\/|$)/, "") || "/";

  return (
    <nav className="sticky bottom-0 z-40" role="navigation" aria-label="Main navigation">
      <div className="glass-bar pb-safe-bottom" style={{ borderTop: "1px solid var(--color-border-subtle)", borderBottom: "none" }}>
        <div className="flex items-end justify-around px-1 pt-1.5 pb-2">
          {TABS.map(({ key, href, Icon, label, ...rest }) => {
            const isPrimary = "isPrimary" in rest && rest.isPrimary;
            const isActive = cleanPath === href || (href !== "/" && cleanPath.startsWith(href));

            if (isPrimary) {
              return (
                <Link
                  key={key}
                  href={href}
                  aria-label={label}
                  className="flex flex-col items-center -mt-5"
                >
                  <div
                    className="flex h-[56px] w-[56px] items-center justify-center rounded-full transition-transform active:scale-90 animate-pulse-glow gradient-brand grain-overlay"
                    style={{ boxShadow: "var(--shadow-brand)" }}
                  >
                    <Icon
                      className="lucide h-[26px] w-[26px] text-white"
                      strokeWidth={2.2}
                    />
                  </div>
                  <span className="mt-0.5 text-[11px] font-bold text-[var(--color-accent)]">{label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={key}
                href={href}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                className="flex flex-col items-center gap-0.5 py-1 touch-target transition-colors"
              >
                <Icon
                  className={`lucide h-[24px] w-[24px] transition-all ${
                    isActive ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"
                  }`}
                  strokeWidth={isActive ? 2 : 1.6}
                />
                <span
                  className={`text-[11px] font-semibold transition-colors ${
                    isActive ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
