"use client";

import { Link, usePathname } from "@/navigation";
import { useTranslations } from "next-intl";
import { Home, BookOpen, MessageCircle, Activity, User } from "lucide-react";

const TABS = [
  { key: "home",    href: "/",       Icon: Home,          labelKey: "home" },
  { key: "learn",   href: "/learn",  Icon: BookOpen,      labelKey: "learn" },
  { key: "chat",    href: "/chat",   Icon: MessageCircle, labelKey: "ask",    isPrimary: true },
  { key: "track",   href: "/track",  Icon: Activity,      labelKey: "track" },
  { key: "profile", href: "/profile", Icon: User,          labelKey: "profile" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  const cleanPath = pathname.replace(/^\/[a-z]{2,3}(?=\/|$)/, "") || "/";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40">
      <div className="border-t border-black/[0.06] bg-white/90 pb-safe-bottom backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center">
          {TABS.map(({ key, href, Icon, labelKey, ...rest }) => {
            const isPrimary = "isPrimary" in rest && rest.isPrimary;
            const isActive = cleanPath === href || (href !== "/" && cleanPath.startsWith(href));

            if (isPrimary) {
              return (
                <Link
                  key={key}
                  href={href}
                  className="flex flex-1 flex-col items-center gap-0.5 py-2"
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full shadow-md transition-all active:scale-90 ${
                      isActive ? "bg-[#C0392B]" : "bg-[#C0392B]"
                    }`}
                  >
                    <Icon className="h-5 w-5 text-white stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#C0392B]">
                    {labelKey === "ask" ? "Ask" : t(labelKey as Parameters<typeof t>[0])}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={key}
                href={href}
                className={`flex flex-1 flex-col items-center gap-0.5 py-3 text-[10px] font-medium transition-colors ${
                  isActive ? "text-[#C0392B]" : "text-gray-400"
                }`}
              >
                <Icon
                  className={`h-6 w-6 transition-all ${isActive ? "stroke-[2.2]" : "stroke-[1.5]"}`}
                />
                <span>{t(labelKey as Parameters<typeof t>[0])}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
