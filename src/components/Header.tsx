"use client";

import { Link } from "@/navigation";
import { LanguagePicker } from "./LanguagePicker";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="flex h-14 items-center justify-between border-b border-black/[0.04] bg-white/80 px-5 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#C0392B] to-[#E74C3C] shadow-sm">
            <span className="text-sm font-black text-white">Z</span>
          </div>
          <span className="text-base font-bold tracking-tight text-gray-900">Zuvo</span>
        </Link>
        <LanguagePicker />
      </div>
    </header>
  );
}
