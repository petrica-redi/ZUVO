"use client";

import { Link } from "@/navigation";

export function Header() {
  return (
    <header className="sticky top-0 z-50">
      <div className="flex h-12 items-center justify-between bg-white/80 px-4 backdrop-blur-2xl">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl shadow-sm"
            style={{ background: "linear-gradient(135deg, #C0392B 0%, #E74C3C 100%)" }}
          >
            <span className="text-sm font-black text-white tracking-tight">Z</span>
          </div>
          <span className="text-[17px] font-extrabold tracking-tight text-gray-900">Sastipe</span>
        </Link>
      </div>
    </header>
  );
}
