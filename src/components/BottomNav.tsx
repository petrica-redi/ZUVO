"use client";

import { Link, usePathname } from "@/navigation";
import { Home, FileText, MessageCircle, Users, Menu } from "lucide-react";

const TABS = [
  { key: "home", href: "/", Icon: Home, label: "Home" },
  { key: "explain", href: "/explain", Icon: FileText, label: "Explain" },
  { key: "chat", href: "/chat", Icon: MessageCircle, label: "Ask", isPrimary: true },
  { key: "family", href: "/family", Icon: Users, label: "Family" },
  { key: "more", href: "/more", Icon: Menu, label: "More" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const cleanPath = pathname.replace(/^\/[a-z]{2,3}(?=\/|$)/, "") || "/";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40" role="navigation" aria-label="Main navigation">
      <div className="border-t border-black/[0.04] bg-white/90 pb-safe-bottom backdrop-blur-2xl">
        <div className="mx-auto flex max-w-lg items-center justify-around px-2">
          {TABS.map(({ key, href, Icon, label, ...rest }) => {
            const isPrimary = "isPrimary" in rest && rest.isPrimary;
            const isActive = cleanPath === href || (href !== "/" && cleanPath.startsWith(href));

            if (isPrimary) {
              return (
                <Link
                  key={key}
                  href={href}
                  aria-label={label}
                  className="flex flex-col items-center gap-0.5 py-1"
                >
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-transform active:scale-90 animate-pulse-glow"
                    style={{ background: "linear-gradient(135deg, #C0392B 0%, #E74C3C 50%, #F39C12 100%)" }}
                  >
                    <Icon className="h-6 w-6 text-white stroke-[2.5]" />
                  </div>
                  <span className="text-[10px] font-bold text-[#C0392B]">{label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={key}
                href={href}
                aria-label={label}
                className={`flex flex-col items-center gap-0.5 px-3 py-2.5 text-[10px] font-semibold transition-all ${
                  isActive ? "text-[#C0392B]" : "text-gray-400"
                }`}
              >
                <Icon
                  className={`h-6 w-6 transition-all ${isActive ? "stroke-[2.2]" : "stroke-[1.5]"}`}
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
