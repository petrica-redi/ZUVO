"use client";

import { Cloud, CloudOff, MapPin, RefreshCw } from "lucide-react";
import { ROMANIA_ECI_COUNTIES } from "@/data/romania-eci-contacts";
import type { SyncStatus } from "@/lib/mediator/workspace-client";
import type { MediatorLabels } from "./labels";

const SYNC_LABEL: Record<SyncStatus, keyof MediatorLabels> = {
  idle: "syncIdle",
  syncing: "syncSyncing",
  synced: "syncSynced",
  offline: "syncOffline",
  error: "syncOffline",
};

export function WorkspaceHeader({
  labels,
  countyCode,
  onChangeCounty,
  syncStatus,
}: {
  labels: MediatorLabels;
  countyCode: string;
  onChangeCounty: (code: string) => void;
  syncStatus: SyncStatus;
}) {
  const labelKey = SYNC_LABEL[syncStatus];
  const tone =
    syncStatus === "synced"
      ? "bg-[var(--color-success-bg)] text-[var(--color-success-text)] ring-[var(--color-success-border)]"
      : syncStatus === "syncing"
        ? "bg-[var(--color-brand-100)] text-[var(--color-brand-800)] ring-[var(--color-brand-200)]"
        : "bg-[var(--color-warning-bg)] text-[var(--color-warning-text)] ring-[var(--color-warning-border)]";

  const Icon =
    syncStatus === "synced"
      ? Cloud
      : syncStatus === "syncing"
        ? RefreshCw
        : CloudOff;

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-white/20 bg-white/12 p-3 shadow-[0_18px_50px_-30px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:flex-row sm:items-end">
      <label className="flex min-w-[220px] flex-1 flex-col gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/70">
        {labels.countyLabel}
        <span className="flex items-center gap-2 rounded-2xl border border-white/25 bg-white/90 px-3 py-2.5 shadow-inner">
          <MapPin className="h-4 w-4 shrink-0 text-[var(--color-sage-700)]" />
          <select
            value={countyCode}
            onChange={(e) => onChangeCounty(e.target.value)}
            className="w-full bg-transparent text-sm font-bold text-[var(--color-text-primary)] outline-none"
          >
            <option value="">{labels.countyPlaceholder}</option>
            {ROMANIA_ECI_COUNTIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </span>
      </label>

      <span
        className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[10px] font-extrabold uppercase tracking-wide ring-1 ${tone}`}
        aria-live="polite"
      >
        <Icon
          className={`h-3 w-3 ${syncStatus === "syncing" ? "animate-spin" : ""}`}
          strokeWidth={2.2}
        />
        {labels[labelKey]}
      </span>
    </div>
  );
}
