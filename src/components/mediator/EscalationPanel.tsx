"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle, CheckCircle2, Eye } from "lucide-react";
import type { EscalationRecord } from "@/lib/operations/types";
import { URGENCY_LABEL_KEYS } from "@/lib/operations/constants";
import {
  fetchEscalations,
  updateEscalation,
} from "@/lib/operations/support-client";
import { EmptyState } from "./parts";

function priorityTone(priority: EscalationRecord["priority"]): string {
  if (priority === "emergency" || priority === "urgent")
    return "bg-[var(--color-danger-bg)] text-[var(--color-danger-text)]";
  if (priority === "priority")
    return "bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]";
  return "bg-[var(--color-sage-100)] text-[var(--color-sage-800)]";
}

export function EscalationPanel({
  onResolved,
}: {
  onResolved?: () => void;
}) {
  const t = useTranslations("operations");
  const [escalations, setEscalations] = useState<EscalationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await fetchEscalations();
    setEscalations(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  const handleAction = async (
    id: string,
    status: EscalationRecord["status"],
  ) => {
    setBusyId(id);
    const updated = await updateEscalation(id, status, notes[id]);
    if (updated) {
      setEscalations((prev) =>
        ["resolved", "dismissed"].includes(status)
          ? prev.filter((e) => e.id !== id)
          : prev.map((e) => (e.id === id ? updated : e)),
      );
      onResolved?.();
    }
    setBusyId(null);
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-[var(--color-warning-accent)]" />
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
          {t("escalationQueueTitle")}
        </h2>
        {escalations.length > 0 && (
          <span className="rounded-full bg-[var(--color-danger-bg)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-danger-text)]">
            {escalations.length}
          </span>
        )}
      </div>

      {escalations.length === 0 && !loading ? (
        <EmptyState message={t("noEscalations")} />
      ) : (
        <div className="space-y-3">
          {escalations.map((esc) => (
            <div
              key={esc.id}
              className="rounded-2xl border border-[var(--color-warning-border)] bg-[var(--color-surface)] p-4 shadow-1"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${priorityTone(esc.priority)}`}
                >
                  {t(URGENCY_LABEL_KEYS[esc.priority])}
                </span>
                <span className="text-[10px] font-bold text-[var(--color-text-muted)]">
                  {t(`escalationStatus_${esc.status}`)}
                </span>
              </div>

              <p className="mb-2 text-sm text-[var(--color-text-primary)]">
                {esc.reason.startsWith("operations.")
                  ? t(esc.reason.replace("operations.", "") as "escalationMissedApptUrgent")
                  : esc.reason}
              </p>

              <p className="mb-3 text-xs text-[var(--color-text-muted)]">
                {esc.caseId && `${t("linkedCase")}: ${esc.caseId.slice(0, 8)}…`}
                {esc.intakeId && ` · ${t("linkedIntake")}: ${esc.intakeId.slice(0, 8)}…`}
              </p>

              <textarea
                placeholder={t("resolutionNotes")}
                value={notes[esc.id] ?? ""}
                onChange={(e) =>
                  setNotes((prev) => ({ ...prev, [esc.id]: e.target.value }))
                }
                rows={2}
                className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-2 text-xs"
              />

              <div className="flex flex-wrap gap-2">
                {esc.status === "open" && (
                  <button
                    type="button"
                    disabled={busyId === esc.id}
                    onClick={() => void handleAction(esc.id, "acknowledged")}
                    className="flex items-center gap-1 rounded-xl bg-[var(--color-info-bg)] px-3 py-2 text-xs font-bold text-[var(--color-info-text)] disabled:opacity-50"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    {t("acknowledgeEscalation")}
                  </button>
                )}
                <button
                  type="button"
                  disabled={busyId === esc.id}
                  onClick={() => void handleAction(esc.id, "resolved")}
                  className="flex items-center gap-1 rounded-xl bg-[var(--color-success-bg)] px-3 py-2 text-xs font-bold text-[var(--color-success-text)] disabled:opacity-50"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {t("resolveEscalation")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
