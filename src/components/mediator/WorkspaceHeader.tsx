"use client";

import { Cloud, CloudOff, RefreshCw } from "lucide-react";
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
      ? "bg-[var(--color-success-bg)] text-[var(--color-success-text)]"
      : syncStatus === "syncing"
        ? "bg-[var(--color-brand-100)] text-[var(--color-brand-800)]"
        : "bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]";

  const Icon =
    syncStatus === "synced"
      ? Cloud
      : syncStatus === "syncing"
        ? RefreshCw
        : CloudOff;

  return (
    <div className="mb-5 flex flex-wrap items-end gap-3">
      <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-xs font-semibold text-[var(--color-text-muted)]">
        {labels.countyLabel}
        <select
          value={countyCode}
          onChange={(e) => onChangeCounty(e.target.value)}
          className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface)] p-2.5 text-sm text-[var(--color-text-primary)]"
        >
          <option value="">{labels.countyPlaceholder}</option>
          {ROMANIA_ECI_COUNTIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide ${tone}`}
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
