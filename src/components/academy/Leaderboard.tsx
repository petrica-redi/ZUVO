"use client";

import { useTranslations } from "next-intl";
import { Trophy, type LucideIcon } from "lucide-react";

type Row = {
  rank: number;
  name: string;
  xp: number;
  isYou?: boolean;
};

const PLACEHOLDER_NAMES = [
  "Ana M.",
  "Florin R.",
  "Aleks K.",
  "Marija S.",
  "Dejan P.",
  "Sara A.",
  "Bekir D.",
  "Larisa V.",
];

/**
 * Anonymized weekly leaderboard preview. Local-state-only seeded with
 * placeholder names — designed to be wired to a real backend later.
 */
export function Leaderboard({
  yourXp,
  country,
}: {
  yourXp: number;
  country: string;
}) {
  const t = useTranslations("studentHealth.l8");

  const rows: Row[] = (() => {
    // Generate stable mock rows: 5 deterministic peers + the user.
    // XP curve is concave so even low XP can crack top-10.
    const peers = PLACEHOLDER_NAMES.slice(0, 5).map((name, i) => ({
      rank: 0,
      name,
      xp: Math.round(yourXp + (5 - i) * 28 + 12),
    }));
    const all: Row[] = [
      ...peers,
      { rank: 0, name: t("leaderboardYou"), xp: yourXp, isYou: true },
    ]
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 5)
      .map((r, i) => ({ ...r, rank: i + 1 }));
    return all;
  })();

  return (
    <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 shadow-1 md:p-6">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--color-ember-500)" }}
            />
            {t("leaderboardSubtitle")}
          </p>
          <h3 className="font-editorial mt-2 text-xl text-[var(--color-text-primary)]">
            {t("leaderboardTitle")}
          </h3>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-surface-subtle)] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-text-secondary)] hairline">
          <Trophy className="lucide h-3.5 w-3.5 text-[var(--color-ember-500)]" strokeWidth={1.9} />
          {country}
        </span>
      </header>

      <ol className="flex flex-col gap-1.5">
        {rows.map((r) => (
          <LeaderRow key={r.rank} row={r} icon={r.rank === 1 ? Trophy : undefined} />
        ))}
      </ol>
    </div>
  );
}

function LeaderRow({ row, icon: Icon }: { row: Row; icon?: LucideIcon }) {
  return (
    <li
      className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 transition-all ${
        row.isYou
          ? "bg-gradient-to-r from-[var(--color-brand-50)] to-[var(--color-ember-50)] ring-1 ring-[var(--color-brand-200)]"
          : "bg-[var(--color-bg-canvas)] hairline"
      }`}
    >
      <span
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${
          row.rank === 1
            ? "bg-gradient-to-br from-[var(--color-ember-400)] to-[var(--color-ember-600)] text-white shadow-1"
            : row.rank === 2
              ? "bg-[var(--color-text-secondary)]/15 text-[var(--color-text-primary)]"
              : row.rank === 3
                ? "bg-[var(--color-ember-100)] text-[var(--color-ember-800)]"
                : "bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] hairline"
        }`}
      >
        {Icon ? <Icon className="lucide h-4 w-4" strokeWidth={2} /> : row.rank}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-bold text-[var(--color-text-primary)]">
        {row.name}
      </span>
      <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-text-secondary)]">
        {row.xp} XP
      </span>
    </li>
  );
}
