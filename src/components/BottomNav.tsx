"use client";

import { Link, usePathname } from "@/navigation";
import { Home, FileText, MessageCircle, Users, LayoutGrid } from "lucide-react";

const TABS = [
  { key: "home", href: "/", Icon: Home, label: "Home" },
  { key: "explain", href: "/explain", Icon: FileText, label: "Explain" },
  { key: "chat", href: "/chat", Icon: MessageCircle, label: "Ask", isPrimary: true },
  { key: "family", href: "/family", Icon: Users, label: "Family" },
  { key: "more", href: "/more", Icon: LayoutGrid, label: "More" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const cleanPath = pathname.replace(/^\/[a-z]{2,3}(?=\/|$)/, "") || "/";

  return (
    <nav
      className="sticky bottom-0 z-40"
      role="navigation"
      aria-label="Main navigation"
    >
      <div
        className="border-t border-white/60 pb-safe-bottom shadow-[0_-4px_24px_rgba(15,23,42,0.06)]"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(250,251,252,0.95) 100%)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        }}
      >
        <div className="mx-auto flex max-w-md items-end justify-around px-1 pb-1.5 pt-1">
          {TABS.map(({ key, href, Icon, label, ...rest }) => {
            const isPrimary = "isPrimary" in rest && rest.isPrimary;
            const isActive = cleanPath === href || (href !== "/" && cleanPath.startsWith(href));

            if (isPrimary) {
              return (
                <Link
                  key={key}
                  href={href}
                  aria-label={label}
                  className="group flex -mt-6 flex-col items-center"
                >
                  <div
                    className="relative flex h-[58px] w-[58px] items-center justify-center rounded-full transition-transform active:scale-90"
                    style={{
                      background: "linear-gradient(145deg, #E85D4C 0%, #C0392B 45%, #A93226 100%)",
                      boxShadow:
                        "0 4px 4px rgba(0,0,0,0.12), 0 12px 28px rgba(192, 57, 43, 0.4), inset 0 1px 0 rgba(255,255,255,0.25)",
                    }}
                  >
                    <span
                      className="pointer-events-none absolute inset-0 rounded-full"
                      style={{
                        background: "radial-gradient(120% 80% at 30% 0%, rgba(255,255,255,0.22), transparent 55%)",
                      }}
                    />
                    <Icon className="relative h-[26px] w-[26px] text-white drop-shadow-sm" strokeWidth={2.4} />
                  </div>
                  <span className="mt-1 text-[10px] font-bold uppercase tracking-wide text-[#A93226]">
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
                className="flex min-w-[3.5rem] flex-col items-center gap-0.5 py-1.5 touch-target"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-2xl transition-all duration-200 ${
                    isActive
                      ? "bg-[#FDF2F2] text-[#C0392B] shadow-sm"
                      : "text-slate-400"
                  }`}
                >
                  <Icon
                    className="h-[22px] w-[22px]"
                    strokeWidth={isActive ? 2.25 : 1.7}
                  />
                </div>
                <span
                  className={`text-[10px] font-bold tracking-tight ${
                    isActive ? "text-[#A93226]" : "text-slate-400"
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
