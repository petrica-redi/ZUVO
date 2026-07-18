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

const DELAYS = [
  "delay-100",
  "delay-200",
  "delay-300",
  "delay-400",
  "delay-500",
  "delay-600",
] as const;

/**
 * Persistent tool menu for every platform surface — home, chatbot, AI search,
 * prescriptions, mediator — without photo heroes.
 */
export function PlatformToolRail() {
  const pathname = usePathname();
  const t = useTranslations("platformNav");
  const clean = stripLocalePrefix(pathname);

  return (
    <nav
      aria-label={t("ariaTools")}
      className="platform-command-rail mb-5 animate-fade-in"
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
              className={`platform-tool-chip shrink-0 animate-fade-in-up ${DELAYS[index] ?? ""}`}
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
