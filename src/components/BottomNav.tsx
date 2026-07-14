"use client";

import { Link, usePathname } from "@/navigation";
import { Home, FileText, MessageCircle, Users, LayoutGrid } from "lucide-react";

import { useTranslations } from "next-intl";

const TABS = [
  { key: "home", href: "/", Icon: Home },
  { key: "explain", href: "/explain", Icon: FileText },
  { key: "chat", href: "/chat", Icon: MessageCircle, isPrimary: true },
  { key: "family", href: "/family", Icon: Users },
  { key: "more", href: "/more", Icon: LayoutGrid },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const cleanPath = pathname.replace(/^\/[a-z]{2,3}(?=\/|$)/, "") || "/";

  return (
    <nav className="sticky bottom-0 z-40" role="navigation" aria-label={t("ariaMain")}>
      <div className="glass-bar pb-safe-bottom" style={{ borderTop: "1px solid var(--color-border-subtle)", borderBottom: "none" }}>
        <div className="flex items-end justify-around px-1 pt-1.5 pb-2">
          {TABS.map(({ key, href, Icon, ...rest }) => {
            const isPrimary = "isPrimary" in rest && rest.isPrimary;
            const isActive = cleanPath === href || (href !== "/" && cleanPath.startsWith(href));
            const label = t(key);

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
                className="group flex flex-col items-center gap-1 py-1 touch-target"
              >
                <span
                  className={`flex h-9 w-[52px] items-center justify-center rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-[var(--color-accent-soft)]"
                      : "bg-transparent group-hover:bg-[var(--color-surface-hover)]"
                  }`}
                  style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
                >
                  <Icon
                    className={`lucide h-[22px] w-[22px] transition-all duration-200 ${
                      isActive
                        ? "text-[var(--color-accent)]"
                        : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]"
                    }`}
                    strokeWidth={isActive ? 2.2 : 1.7}
                  />
                </span>
                <span
                  className={`text-[10.5px] leading-none transition-colors ${
                    isActive
                      ? "font-bold text-[var(--color-accent)]"
                      : "font-semibold text-[var(--color-text-muted)]"
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
