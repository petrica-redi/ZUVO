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
    <nav className="fixed inset-x-0 bottom-0 z-40">
      <div className="border-t border-black/[0.04] bg-white/95 pb-safe-bottom backdrop-blur-2xl">
        <div className="mx-auto flex max-w-lg items-center">
          {TABS.map(({ key, href, Icon, label, ...rest }) => {
            const isPrimary = "isPrimary" in rest && rest.isPrimary;
            const isActive = cleanPath === href || (href !== "/" && cleanPath.startsWith(href));

            if (isPrimary) {
              return (
                <Link
                  key={key}
                  href={href}
                  className="flex flex-1 flex-col items-center gap-0.5 py-1.5"
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform active:scale-90"
                    style={{ background: "linear-gradient(135deg, #C0392B 0%, #E74C3C 100%)" }}
                  >
                    <Icon className="h-5 w-5 text-white stroke-[2.5]" />
                  </div>
                  <span className="text-[10px] font-bold text-[#C0392B]">{label}</span>
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
                  className={`h-[22px] w-[22px] transition-all ${isActive ? "stroke-[2.2]" : "stroke-[1.5]"}`}
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
