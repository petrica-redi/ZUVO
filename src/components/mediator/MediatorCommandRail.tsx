"use client";

import { Link, usePathname } from "@/navigation";
import { useTranslations } from "next-intl";
import {
  FileText,
  HandHeart,
  Home,
  MessageCircle,
  ScanSearch,
  Shield,
} from "lucide-react";
import { stripLocalePrefix } from "@/lib/demo/persona-models";

const TOOLS = [
  { href: "/", key: "home", Icon: Home },
  { href: "/chat", key: "chat", Icon: MessageCircle },
  { href: "/scan", key: "scan", Icon: ScanSearch },
  { href: "/explain", key: "explain", Icon: FileText },
  { href: "/mediator", key: "mediator", Icon: Shield },
  { href: "/help", key: "help", Icon: HandHeart },
] as const;

/**
 * Immediate-access tool rail for the mediator workspace — home, AI chat,
 * claim search, prescription explain, and field tools without a photo hero.
 */
export function MediatorCommandRail() {
  const pathname = usePathname();
  const t = useTranslations("platformNav");
  const clean = stripLocalePrefix(pathname);

  return (
    <nav
      aria-label={t("ariaTools")}
      className="mediator-command-rail mb-5 animate-fade-in"
    >
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TOOLS.map(({ href, key, Icon }, index) => {
          const active =
            href === "/"
              ? clean === "/"
              : clean === href || clean.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`mediator-tool-chip shrink-0 animate-fade-in-up delay-${(index + 1) * 100}`}
              data-active={active ? "true" : "false"}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={2.1} />
              <span>{t(key)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
