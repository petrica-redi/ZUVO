"use client";

import { Link } from "@/navigation";
import { LogoWordmark } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50">
      <div className="glass-bar flex h-14 items-center justify-between px-4">
        <Link href="/" className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]">
          <LogoWordmark iconSize={30} />
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
