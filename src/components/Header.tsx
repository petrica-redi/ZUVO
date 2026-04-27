"use client";

import { Link } from "@/navigation";
import { Logo } from "@/components/Logo";
import { LanguagePicker } from "@/components/LanguagePicker";

/**
 * Sticky top bar: frosted glass, brand mark, language.
 * Keeps a premium “native app” feel on narrow viewports.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50">
      <div
        className="flex h-14 items-center justify-between border-b border-white/50 px-4 shadow-[0_1px_0_rgba(255,255,255,0.6)]"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0.72) 100%)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        }}
      >
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 rounded-xl py-1 pr-1 outline-none transition-transform active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#C0392B]/30"
        >
          <div className="flex-shrink-0 drop-shadow-sm">
            <Logo size={38} className="shadow-sm" />
          </div>
          <span
            className="truncate text-lg font-extrabold leading-none tracking-[-0.04em] text-slate-900"
            style={{
              textShadow: "0 1px 0 rgba(255,255,255,0.8)",
            }}
          >
            Sastipe
          </span>
        </Link>
        <LanguagePicker />
      </div>
    </header>
  );
}
