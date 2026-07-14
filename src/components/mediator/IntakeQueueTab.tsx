"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Phone, RefreshCw, UserPlus } from "lucide-react";
import type { IntakeRequest } from "@/lib/operations/types";
import {
  convertIntake,
  fetchIntakes,
  routeIntakeRequest,
} from "@/lib/operations/support-client";
import { EmptyState, FormCard, SaveButton } from "./parts";

function statusTone(status: IntakeRequest["status"]): string {
  if (status === "new") return "bg-[var(--color-info-bg)] text-[var(--color-info-text)]";
  if (status === "routed" || status === "assigned")
    return "bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]";
  if (status === "converted")
    return "bg-[var(--color-success-bg)] text-[var(--color-success-text)]";
  return "bg-[var(--color-sage-100)] text-[var(--color-sage-800)]";
}

export function IntakeQueueTab({
  onConverted,
}: {
  onConverted?: () => void;
}) {
  const t = useTranslations("operations");
  const [intakes, setIntakes] = useState<IntakeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [pseudonym, setPseudonym] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await fetchIntakes();
    setIntakes(data.filter((i) => !["converted", "closed"].includes(i.status)));
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  const handleRoute = async (intakeId: string) => {
    setBusyId(intakeId);
    const routed = await routeIntakeRequest(intakeId);
    if (routed) {
      setIntakes((prev) =>
        prev.map((i) => (i.id === intakeId ? { ...i, ...routed } : i)),
      );
    }
    setBusyId(null);
  };

  const handleConvert = async (intakeId: string) => {
    if (!pseudonym.trim()) return;
    setBusyId(intakeId);
    const ok = await convertIntake(intakeId, pseudonym.trim());
    if (ok) {
      setConvertingId(null);
      setPseudonym("");
      await refresh();
      onConverted?.();
    }
    setBusyId(null);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
          {t("intakeQueueTitle")}
        </h2>
        <button
          type="button"
          onClick={() => void refresh()}
          className="flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-[var(--color-sage-700)]"
          aria-label={t("refreshQueue")}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {t("refreshQueue")}
        </button>
      </div>

      {intakes.length === 0 && !loading ? (
        <EmptyState message={t("noIntakes")} />
      ) : (
        <div className="space-y-3">
          {intakes.map((intake) => (
            <div
              key={intake.id}
              className="rounded-2xl bg-[var(--color-surface)] p-4 shadow-1"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-extrabold text-[var(--color-text-primary)]">
                  {intake.referenceCode}
                </span>
                <span
                  className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${statusTone(intake.status)}`}
                >
                  {t(`intakeStatus_${intake.status}`)}
                </span>
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  {t(`helpType_${intake.helpType}`)}
                </span>
              </div>

              <p className="mb-1 text-xs text-[var(--color-text-secondary)]">
                {t("contactMethod")}: {t(`contact_${intake.contactMethod}`)}
                {intake.contactValue ? ` · ${intake.contactValue}` : ""}
              </p>
              <p className="mb-1 text-xs text-[var(--color-text-muted)]">
                {intake.countryCode}
                {intake.municipalityCode ? ` / ${intake.municipalityCode}` : ""}
                {" · "}
                {intake.preferredLanguage.toUpperCase()}
              </p>
              {intake.routedTeamName && (
                <p className="mb-2 text-xs font-semibold text-[var(--color-sage-700)]">
                  {t("routedTo")}: {intake.routedTeamName}
                </p>
              )}
              {intake.notes && (
                <p className="mb-3 text-sm text-[var(--color-text-secondary)]">
                  {intake.notes}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {intake.status === "new" && (
                  <button
                    type="button"
                    disabled={busyId === intake.id}
                    onClick={() => void handleRoute(intake.id)}
                    className="flex items-center gap-1 rounded-xl bg-[var(--color-sage-700)] px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {t("routeIntake")}
                  </button>
                )}
                {["new", "routed", "assigned"].includes(intake.status) && (
                  <button
                    type="button"
                    onClick={() => {
                      setConvertingId(intake.id);
                      setPseudonym("");
                    }}
                    className="flex items-center gap-1 rounded-xl border border-[var(--color-sage-300)] px-3 py-2 text-xs font-bold text-[var(--color-sage-800)]"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    {t("convertToCase")}
                  </button>
                )}
              </div>

              {convertingId === intake.id && (
                <FormCard>
                  <label className="mb-1 block text-xs font-bold text-[var(--color-text-muted)]">
                    {t("beneficiaryPseudonym")}
                  </label>
                  <input
                    type="text"
                    value={pseudonym}
                    onChange={(e) => setPseudonym(e.target.value)}
                    className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
                  />
                  <SaveButton
                    saved={false}
                    savedLabel=""
                    saveLabel={t("convertToCase")}
                    disabled={!pseudonym.trim() || busyId === intake.id}
                    onClick={() => void handleConvert(intake.id)}
                  />
                </FormCard>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
