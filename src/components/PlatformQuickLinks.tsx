"use client";

import { Link, usePathname } from "@/navigation";
import { useTranslations } from "next-intl";
import { HandHeart, MapPin, Shield, BarChart3 } from "lucide-react";
import { stripLocalePrefix } from "@/lib/demo/persona-models";

const LINKS = [
  { href: "/help", key: "help", Icon: HandHeart },
  { href: "/providers", key: "providers", Icon: MapPin },
  { href: "/mediator", key: "mediator", Icon: Shield },
  { href: "/impact", key: "impact", Icon: BarChart3 },
] as const;

/** Compact platform links for app shell header — help, providers, mediator, impact. */
export function PlatformQuickLinks() {
  const pathname = usePathname();
  const t = useTranslations("platformNav");
  const clean = stripLocalePrefix(pathname);

  return (
    <nav
      aria-label={t("aria")}
      className="hidden items-center gap-1 sm:flex"
    >
      {LINKS.map(({ href, key, Icon }) => {
        const active = clean === href || clean.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors ${
              active
                ? "bg-[var(--color-sage-100)] text-[var(--color-sage-800)]"
                : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2} />
            <span>{t(key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
