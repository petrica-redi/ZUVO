"use client";

import { useEffect, useState } from "react";
import { Link } from "@/navigation";
import { ChevronRight } from "lucide-react";

type PillarMeta = {
  id: string;
  emoji: string;
  color: string;
  href: string;
  total: number;
};

const PROGRESS_KEY = "sastipe_progress";

function getCompletedCount(pillarId: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return 0;
    const p = JSON.parse(raw) as Record<string, string>;
    const prefix = `${pillarId}:`;
    return Object.keys(p).filter((k) => k.startsWith(prefix) && p[k] === "completed").length;
  } catch {
    return 0;
  }
}

export function LearnProgressClient({
  pillars,
  pillarNames,
  continueLabel,
  progressLabel,
}: {
  pillars: PillarMeta[];
  pillarNames: string[];
  continueLabel: string;
  progressLabel: string;
}) {
  const [progress, setProgress] = useState<number[]>(pillars.map(() => 0));

  useEffect(() => {
    const nextProgress = pillars.map((p) => getCompletedCount(p.id));
    const timer = setTimeout(() => {
      setProgress(nextProgress);
    }, 0);
    return () => clearTimeout(timer);
  }, [pillars]);

  const totalModules = pillars.reduce((s, p) => s + p.total, 0);
  const completedModules = progress.reduce((s, c) => s + c, 0);

  return (
    <div>
      {completedModules > 0 && (
        <div className="mb-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] p-4 shadow-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">{progressLabel}</span>
            <span className="text-xs font-bold text-[var(--color-text-secondary)]">{completedModules} / {totalModules}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-[var(--color-border-subtle)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--color-success-accent)] transition-all duration-500"
              style={{ width: `${Math.round((completedModules / Math.max(totalModules, 1)) * 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {pillars.map((pillar, i) => {
          const done = progress[i] ?? 0;
          const pct = pillar.total > 0 ? Math.round((done / pillar.total) * 100) : 0;
          return (
            <Link
              key={pillar.id}
              href={pillar.href}
              className="flex items-center gap-4 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 shadow-1 transition-all hover:shadow-2 active:scale-[0.99]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl flex-shrink-0">
                {pillar.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-[var(--color-text-primary)]">
                  {pillarNames[i]}
                </span>
                {done > 0 && (
                  <div className="mt-1.5">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] text-[var(--color-text-muted)]">{done}/{pillar.total}</span>
                      {pct === 100 && <span className="text-[10px] font-bold text-[var(--color-success-accent)]">✓</span>}
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[var(--color-border-subtle)] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%`, backgroundColor: pillar.color }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <ChevronRight className="lucide h-5 w-5 text-[var(--color-text-muted)] flex-shrink-0" strokeWidth={1.75} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
