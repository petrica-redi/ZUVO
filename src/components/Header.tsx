"use client";

import { Link } from "@/navigation";
import { LogoWordmark } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguagePicker } from "@/components/LanguagePicker";

/**
 * Internal-pages header (chat, symptoms, mediator, etc). Mirrors the marketing
 * `LandingHeader` so the language picker is reachable on every screen, not just
 * the homepage. Picker uses the `landing` styling variant to match the glass-bar.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50">
      <div className="glass-bar flex h-14 items-center justify-between gap-2 px-4">
        <Link href="/" className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]">
          <LogoWordmark iconSize={30} />
        </Link>
        <div className="flex items-center gap-2">
          <LanguagePicker variant="landing" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
