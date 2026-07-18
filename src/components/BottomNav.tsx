"use client";

import { Suspense } from "react";
import { Link, usePathname } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useDemoPersona } from "@/components/demo/DemoPersonaProvider";
import { stripLocalePrefix } from "@/lib/demo/persona-models";
import {
  Home,
  FileText,
  MessageCircle,
  LayoutGrid,
  Inbox,
  ScanSearch,
} from "lucide-react";

/** Global dock: home + AI search + chatbot + prescriptions on every page. */
const DEFAULT_TABS = [
  { key: "home", href: "/", Icon: Home },
  { key: "scan", href: "/scan", Icon: ScanSearch },
  { key: "chat", href: "/chat", Icon: MessageCircle, isPrimary: true },
  { key: "explain", href: "/explain", Icon: FileText },
  { key: "more", href: "/more", Icon: LayoutGrid },
] as const;

/**
 * Field chrome keeps platform tools reachable (home, AI scan, chat, Rx)
 * while the centre shortcut returns to the mediator inbox.
 */
const FIELD_TABS = [
  { key: "home", href: "/", Icon: Home },
  { key: "scan", href: "/scan", Icon: ScanSearch },
  { key: "chat", href: "/chat", Icon: MessageCircle, isPrimary: true },
  { key: "explain", href: "/explain", Icon: FileText },
  { key: "fieldInbox", href: "/mediator?tab=inbox", Icon: Inbox },
] as const;

function BottomNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tNav = useTranslations("nav");
  const tDemo = useTranslations("demo");
  const { demoMode, model } = useDemoPersona();
  const cleanPath = stripLocalePrefix(pathname);
  const onFieldSurface =
    cleanPath === "/mediator" || cleanPath.startsWith("/mediator/");
  const currentTab = searchParams.get("tab") ?? "inbox";

  const tabs = demoMode
    ? model.navTabs
    : onFieldSurface
      ? FIELD_TABS
      : DEFAULT_TABS;

  return (
    <nav
      className="sticky bottom-0 z-40 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2"
      role="navigation"
      aria-label={demoMode ? tDemo("navAria") : tNav("ariaMain")}
    >
      <div className="nav-dock mx-auto max-w-md rounded-[26px]">
        <div className="flex items-end justify-around px-1.5 pt-1.5 pb-1.5">
          {tabs.map(({ key, href, Icon, ...rest }) => {
            const isPrimary = "isPrimary" in rest && rest.isPrimary;
            const hrefPath = href.split("?")[0] ?? href;
            const hrefTab = href.includes("tab=")
              ? new URLSearchParams(href.split("?")[1] ?? "").get("tab")
              : null;
            const isActive = onFieldSurface
              ? hrefTab
                ? currentTab === hrefTab
                : hrefPath === "/"
                  ? cleanPath === "/"
                  : cleanPath === hrefPath || cleanPath.startsWith(`${hrefPath}/`)
              : cleanPath === hrefPath ||
                (hrefPath !== "/" && cleanPath.startsWith(hrefPath));
            const label = demoMode
              ? tDemo(`nav.${model.id}.${key}` as "nav.community.home")
              : tNav(key as "home");

            if (isPrimary) {
              return (
                <Link
                  key={key}
                  href={href}
                  aria-label={label}
                  className="flex flex-col items-center -mt-7"
                >
                  <div
                    className="flex h-[58px] w-[58px] items-center justify-center rounded-[20px] transition-transform active:scale-90 animate-pulse-glow gradient-brand grain-overlay ring-4 ring-[var(--color-bg-canvas)]"
                    style={{ boxShadow: "var(--shadow-brand)" }}
                  >
                    <Icon className="lucide h-[26px] w-[26px] text-white" strokeWidth={2.2} />
                  </div>
                  <span className="mt-1 text-[11px] font-bold text-[var(--color-accent)]">
                    {label}
                  </span>
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

export function BottomNav() {
  return (
    <Suspense fallback={<div className="h-16" aria-hidden />}>
      <BottomNavInner />
    </Suspense>
  );
}
