"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Home, BookOpen, Activity, Users, User } from "lucide-react";

const TABS = [
  { key: "home",     href: "/",          Icon: Home,      labelKey: "home" },
  { key: "learn",    href: "/learn",     Icon: BookOpen,  labelKey: "learn" },
  { key: "track",    href: "/track",     Icon: Activity,  labelKey: "track" },
  { key: "mediator", href: "/mediator",  Icon: Users,     labelKey: "mediator" },
  { key: "profile",  href: "/profile",   Icon: User,      labelKey: "profile" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  // Determine the "clean" path without locale prefix for matching
  const cleanPath = pathname.replace(/^\/[a-z]{2,3}(?=\/|$)/, "") || "/";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40">
      <div className="border-t border-black/[0.06] bg-white/90 pb-safe-bottom backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center">
          {TABS.map(({ key, href, Icon, labelKey }) => {
            const isActive = cleanPath === href || (href !== "/" && cleanPath.startsWith(href));
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
                <span>{t(labelKey)}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
