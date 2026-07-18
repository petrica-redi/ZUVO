"use client";

import { Link, usePathname } from "@/navigation";
import { useTranslations } from "next-intl";
import {
  BarChart3,
  FileText,
  Home,
  MessageCircle,
  ScanSearch,
  Shield,
} from "lucide-react";
import { stripLocalePrefix } from "@/lib/demo/persona-models";

const LINKS = [
  { href: "/", key: "home", Icon: Home },
  { href: "/chat", key: "chat", Icon: MessageCircle },
  { href: "/scan", key: "scan", Icon: ScanSearch },
  { href: "/explain", key: "explain", Icon: FileText },
  { href: "/mediator", key: "mediator", Icon: Shield },
  { href: "/impact", key: "impact", Icon: BarChart3 },
] as const;

/** Persistent platform tools in the app header — home, AI, Rx, mediator, impact. */
export function PlatformQuickLinks() {
  const pathname = usePathname();
  const t = useTranslations("platformNav");
  const clean = stripLocalePrefix(pathname);

  return (
    <nav
      aria-label={t("aria")}
      className="flex min-w-0 flex-1 items-center justify-center overflow-x-auto scrollbar-none"
    >
      <div className="flex items-center gap-0.5 sm:gap-1">
        {LINKS.map(({ href, key, Icon }) => {
          const active =
            href === "/"
              ? clean === "/"
              : clean === href || clean.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              title={t(key)}
              className={`inline-flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-bold transition-colors sm:px-3 ${
                active
                  ? "bg-[var(--color-accent-soft)] text-[var(--color-accent-text)]"
                  : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
              <span className="hidden md:inline">{t(key)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
