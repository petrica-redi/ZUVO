"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, RefreshCw, ShieldAlert } from "lucide-react";
import type { QualityFlag } from "@/lib/operations/types";
import {
  getOrCreateWorkspaceId,
} from "@/lib/mediator/workspace-client";

type QualityCapabilities = {
  canResolve: boolean;
  canScan: boolean;
};

function workspaceHeaders(): Record<string, string> {
  const workspaceId = getOrCreateWorkspaceId();
  const headers: Record<string, string> = { "x-workspace-id": workspaceId };
  if (typeof window !== "undefined") {
    const secret = localStorage.getItem("redi_mediator_workspace_secret");
    if (secret) headers["x-workspace-secret"] = secret;
    const role = localStorage.getItem("redi_operations_role");
    if (role) headers["x-operations-role"] = role;
  }
  return headers;
}

const SEVERITY_TONE: Record<QualityFlag["severity"], string> = {
  info: "text-blue-700 bg-blue-50",
  warning: "text-amber-800 bg-amber-50",
  critical: "text-red-800 bg-red-50",
};

export function QualityPanel({
  title,
  subtitle,
  emptyMessage,
  scanLabel,
  resolveLabel,
  flagTypeLabels,
  severityLabels,
  statusLabels,
}: {
  title: string;
  subtitle: string;
  emptyMessage: string;
  scanLabel: string;
  resolveLabel: string;
  flagTypeLabels: Record<string, string>;
  severityLabels: Record<string, string>;
  statusLabels: Record<string, string>;
}) {
  const [flags, setFlags] = useState<QualityFlag[]>([]);
  const [capabilities, setCapabilities] = useState<QualityCapabilities>({
    canResolve: false,
    canScan: false,
  });
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/operations/quality?status=open", {
        headers: workspaceHeaders(),
      });
      if (!res.ok) {
        setFlags([]);
        return;
      }
      const json = (await res.json()) as {
        success?: boolean;
        data?: QualityFlag[];
        capabilities?: QualityCapabilities;
      };
      setFlags(json.data ?? []);
      setCapabilities(json.capabilities ?? { canResolve: false, canScan: false });
    } catch {
      setFlags([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const runScan = async () => {
    setScanning(true);
    try {
      await fetch("/api/operations/quality", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...workspaceHeaders() },
        body: JSON.stringify({ action: "scan" }),
      });
      await refresh();
    } finally {
      setScanning(false);
    }
  };

  const resolveFlag = async (flagId: string) => {
    await fetch("/api/operations/quality", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...workspaceHeaders() },
      body: JSON.stringify({ flagId, status: "resolved" }),
    });
    await refresh();
  };

  const openCount = flags.filter((f) => f.status === "open").length;

  return (
    <section className="mb-6 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 shadow-1">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-[var(--color-text-primary)]">
            <ShieldAlert className="h-4 w-4 text-amber-600" />
            {title}
          </h2>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{subtitle}</p>
        </div>
        {capabilities.canScan && (
          <button
            type="button"
            onClick={() => void runScan()}
            disabled={scanning}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-surface-subtle)] px-3 py-2 text-[11px] font-extrabold text-[var(--color-text-primary)]"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${scanning ? "animate-spin" : ""}`} />
            {scanLabel}
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-xs text-[var(--color-text-muted)]">…</p>
      ) : openCount === 0 ? (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          {emptyMessage}
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {flags.map((flag) => (
            <li
              key={flag.id}
              className="rounded-xl border border-[var(--color-border-subtle)] p-3"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${SEVERITY_TONE[flag.severity]}`}
                >
                  {severityLabels[flag.severity] ?? flag.severity}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  {flagTypeLabels[flag.flagType] ?? flag.flagType}
                </span>
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  {statusLabels[flag.status] ?? flag.status}
                </span>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {flag.message || flagTypeLabels[flag.flagType]}
              </p>
              {capabilities.canResolve && flag.status === "open" && (
                <button
                  type="button"
                  onClick={() => void resolveFlag(flag.id)}
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {resolveLabel}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
