import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kreu",
  description: "Mjete arsimimi shëndetësor ndërtuar për komunitetet rome.",
};

const HEALTH_PILLARS = [
  {
    id: "preventim",
    label: "Preventim",
    emoji: "🛡️",
    colorClass: "bg-[#16a34a]",
    href: "/learn/preventim",
  },
  {
    id: "ushqyerja",
    label: "Ushqyerja",
    emoji: "🥗",
    colorClass: "bg-[#2563eb]",
    href: "/learn/ushqyerja",
  },
  {
    id: "nena",
    label: "Shëndeti i nënës",
    emoji: "🤱",
    colorClass: "bg-[#9333ea]",
    href: "/learn/nena",
  },
  {
    id: "femijeria",
    label: "Fëmijët",
    emoji: "👶",
    colorClass: "bg-[#ea580c]",
    href: "/learn/femijeria",
  },
  {
    id: "kronike",
    label: "Sëmundje kronike",
    emoji: "💊",
    colorClass: "bg-[#dc2626]",
    href: "/learn/kronike",
  },
  {
    id: "mendore",
    label: "Shëndeti mendor",
    emoji: "🧠",
    colorClass: "bg-[#0891b2]",
    href: "/learn/mendore",
  },
] as const;

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f7]">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <header className="flex flex-col items-center gap-5 px-6 pb-10 pt-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#c0392b] shadow-lg">
          <span className="text-4xl" role="img" aria-label="heart">
            ❤
          </span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Sastipe
          </h1>
          <p className="max-w-xs text-base text-gray-500">
            Shëndet e mirë fillon këtu. Mëso, ndiq, dhe ruaj shëndetin tënd.
          </p>
        </div>

        <Link
          href="/learn"
          className="mt-1 inline-flex h-14 min-w-[180px] items-center justify-center rounded-full bg-[#c0392b] px-8 text-base font-semibold text-white shadow-sm transition-all hover:bg-[#922b21] active:scale-95"
        >
          Fillo tani →
        </Link>
      </header>

      {/* ── Health pillars grid ───────────────────────────────────────────── */}
      <main className="flex-1 px-4 pb-16">
        <p className="mb-5 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
          Zona shëndetësore
        </p>

        <div className="mx-auto grid max-w-md grid-cols-2 gap-4">
          {HEALTH_PILLARS.map((pillar) => (
            <Link
              key={pillar.id}
              href={pillar.href}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md active:scale-95"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-full text-3xl ${pillar.colorClass} bg-opacity-10`}
              >
                {pillar.emoji}
              </span>
              <span className="text-center text-sm font-semibold leading-snug text-gray-800">
                {pillar.label}
              </span>
            </Link>
          ))}
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="py-6 text-center text-xs text-gray-400">
        Sastipe &mdash; Shëndet për të gjithë
      </footer>
    </div>
  );
}
