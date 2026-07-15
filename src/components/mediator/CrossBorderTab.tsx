"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Globe, ShieldAlert } from "lucide-react";
import {
  HANDOVER_STATUS_LABEL_KEYS,
  type HandoverStatus,
} from "@/lib/operations/handover-constants";
import { URGENCY_LABEL_KEYS } from "@/lib/operations/constants";
import { renderGuidanceTemplate } from "@/lib/operations/guidance-shared";
import type { CrossBorderHandover } from "@/lib/operations/handover-service";
import type { NavigationCase } from "@/lib/operations/types";
import type { CrossBorderState } from "./useCrossBorder";
import { EmptyState, FormCard, SaveButton } from "./parts";
import { getOrCreateWorkspaceId } from "@/lib/mediator/workspace-client";

const COUNTRY_OPTIONS = [
  { code: "RO", label: "Romania" },
  { code: "IT", label: "Italy" },
  { code: "HU", label: "Hungary" },
  { code: "BG", label: "Bulgaria" },
];

function statusTone(status: HandoverStatus): string {
  if (status === "completed") return "bg-[var(--color-success-bg)] text-[var(--color-success-text)]";
  if (status === "rejected" || status === "cancelled") {
    return "bg-[var(--color-danger-bg)] text-[var(--color-danger-text)]";
  }
  if (status === "consent_pending") {
    return "bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]";
  }
  return "bg-[var(--color-info-bg)] text-[var(--color-info-text)]";
}

function HandoverCard({
  handover,
  workspaceId,
  onAction,
}: {
  handover: CrossBorderHandover;
  workspaceId: string;
  onAction: CrossBorderState["handoverAction"];
}) {
  const t = useTranslations("operations");
  const isOrigin = handover.originWorkspaceId === workspaceId;
  const isDestination = handover.destinationWorkspaceId === workspaceId;
  const [rejectReason, setRejectReason] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async (
    action: Parameters<CrossBorderState["handoverAction"]>[1],
    reason?: string,
  ) => {
    setBusy(true);
    await onAction(handover.id, action, reason);
    setBusy(false);
  };

  return (
    <div className="rounded-2xl bg-[var(--color-surface)] p-4 shadow-1">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold text-[var(--color-text-primary)]">
          {handover.caseNumber}
        </span>
        <span className="text-xs text-[var(--color-text-muted)]">
          {handover.originCountryCode} → {handover.destinationCountryCode}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusTone(handover.status)}`}
        >
          {t(HANDOVER_STATUS_LABEL_KEYS[handover.status].replace("operations.", ""))}
        </span>
      </div>

      {handover.reason && (
        <p className="mb-2 text-xs text-[var(--color-text-secondary)]">{handover.reason}</p>
      )}

      {handover.consentStatus !== "granted" && (
        <div className="mb-3 flex items-start gap-2 rounded-xl bg-[var(--color-warning-bg)] p-3 text-xs text-[var(--color-warning-text)]">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{t("handoverConsentRequired")}</span>
        </div>
      )}

      {handover.navigationSummary ? (
        <div className="mb-3 rounded-xl bg-[var(--color-surface-subtle)] p-3 text-xs">
          <p className="font-semibold text-[var(--color-text-primary)]">
            {t("handoverNavigationSummary")}
          </p>
          <p className="text-[var(--color-text-secondary)]">
            {handover.navigationSummary.beneficiaryPseudonym} ·{" "}
            {t(`category_${handover.navigationSummary.categorySlug}`)} ·{" "}
            {t(
              URGENCY_LABEL_KEYS[
                handover.navigationSummary.urgency as keyof typeof URGENCY_LABEL_KEYS
              ].replace("operations.", ""),
            )}
          </p>
          <p className="mt-1 text-[var(--color-text-muted)]">
            {handover.navigationSummary.mainProblem}
          </p>
        </div>
      ) : (
        <p className="mb-3 text-xs italic text-[var(--color-text-muted)]">
          {t("handoverDataLocked")}
        </p>
      )}

      {handover.sharedPayload?.contactMethod && (
        <p className="mb-3 text-xs text-[var(--color-text-secondary)]">
          {t("handoverContactMethod")}: {handover.sharedPayload.contactMethod}
        </p>
      )}

      {handover.rejectionReason && (
        <p className="mb-3 text-xs text-[var(--color-danger-text)]">
          {t("handoverRejectionReason")}: {handover.rejectionReason}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {isOrigin && handover.status === "consent_pending" && (
          <button
            type="button"
            disabled={busy}
            onClick={() => run("record_consent")}
            className="rounded-lg bg-[var(--color-sage-700)] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {t("handoverRecordConsent")}
          </button>
        )}
        {isOrigin && handover.consentStatus === "granted" && handover.status === "consent_pending" && (
          <button
            type="button"
            disabled={busy}
            onClick={() => run("request")}
            className="rounded-lg bg-[var(--color-sage-700)] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {t("handoverRequest")}
          </button>
        )}
        {isDestination && handover.status === "requested" && (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => run("accept")}
              className="rounded-lg bg-[var(--color-success-accent)] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              {t("handoverAccept")}
            </button>
            <input
              type="text"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={t("handoverRejectPlaceholder")}
              className="min-w-[140px] flex-1 rounded-lg border border-[var(--color-border)] px-2 py-2 text-xs"
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => run("reject", rejectReason)}
              className="rounded-lg bg-[var(--color-danger-accent)] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              {t("handoverReject")}
            </button>
          </>
        )}
        {(isOrigin || isDestination) &&
          ["accepted", "in_progress"].includes(handover.status) && (
            <button
              type="button"
              disabled={busy}
              onClick={() => run("complete")}
              className="rounded-lg bg-[var(--color-info-accent)] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              {t("handoverComplete")}
            </button>
          )}
        {isOrigin && !["completed", "cancelled", "rejected"].includes(handover.status) && (
          <button
            type="button"
            disabled={busy}
            onClick={() => run("cancel")}
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs font-semibold text-[var(--color-text-muted)] disabled:opacity-50"
          >
            {t("handoverCancel")}
          </button>
        )}
      </div>
    </div>
  );
}

export function CrossBorderTab({
  cases,
  crossBorder,
}: {
  cases: NavigationCase[];
  crossBorder: CrossBorderState;
}) {
  const t = useTranslations("operations");
  const workspaceId = getOrCreateWorkspaceId();
  const [open, setOpen] = useState(false);
  const [caseId, setCaseId] = useState("");
  const [destination, setDestination] = useState("IT");
  const [destWorkspace, setDestWorkspace] = useState("");
  const [reason, setReason] = useState("");
  const [saved, setSaved] = useState(false);
  const [guidanceOrigin, setGuidanceOrigin] = useState("RO");
  const [guidanceDest, setGuidanceDest] = useState("IT");

  const crossBorderCases = useMemo(
    () => cases.filter((c) => c.categorySlug === "cross_border" || c.barriers.includes("cross_border")),
    [cases],
  );

  useEffect(() => {
    void crossBorder.loadGuidance(guidanceOrigin, guidanceDest);
  }, [guidanceOrigin, guidanceDest, crossBorder.loadGuidance]);

  const submit = async () => {
    if (!caseId) return;
    const row = await crossBorder.createHandover({
      caseId,
      destinationCountryCode: destination,
      destinationWorkspaceId: destWorkspace.trim() || undefined,
      reason: reason.trim(),
    });
    if (row) {
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setOpen(false);
        setCaseId("");
        setReason("");
        setDestWorkspace("");
      }, 1500);
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-[var(--color-sage-700)]" />
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
            {t("crossBorderTitle")}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-xl bg-[var(--color-sage-700)] px-4 py-2 text-xs font-semibold text-white"
        >
          {t("handoverNew")}
        </button>
      </div>

      <p className="mb-4 text-xs text-[var(--color-text-muted)]">{t("crossBorderHint")}</p>

      {open && (
        <FormCard>
          <label className="mb-1 block text-xs font-semibold text-[var(--color-text-secondary)]">
            {t("handoverSelectCase")}
          </label>
          <select
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
            className="mb-3 w-full rounded-xl border border-[var(--color-border)] p-3 text-sm"
          >
            <option value="">{t("handoverSelectCasePlaceholder")}</option>
            {(crossBorderCases.length ? crossBorderCases : cases).map((c) => (
              <option key={c.id} value={c.id}>
                {c.caseNumber} — {c.beneficiaryPseudonym}
              </option>
            ))}
          </select>

          <label className="mb-1 block text-xs font-semibold text-[var(--color-text-secondary)]">
            {t("handoverDestinationCountry")}
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="mb-3 w-full rounded-xl border border-[var(--color-border)] p-3 text-sm"
          >
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>

          <label className="mb-1 block text-xs font-semibold text-[var(--color-text-secondary)]">
            {t("handoverDestinationWorkspace")}
          </label>
          <input
            type="text"
            value={destWorkspace}
            onChange={(e) => setDestWorkspace(e.target.value)}
            placeholder={t("handoverDestinationWorkspacePlaceholder")}
            className="mb-3 w-full rounded-xl border border-[var(--color-border)] p-3 text-sm"
          />

          <label className="mb-1 block text-xs font-semibold text-[var(--color-text-secondary)]">
            {t("handoverReason")}
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="mb-4 w-full rounded-xl border border-[var(--color-border)] p-3 text-sm"
            placeholder={t("handoverReasonPlaceholder")}
          />

          <div className="mb-4 flex items-start gap-2 rounded-xl bg-[var(--color-warning-bg)] p-3 text-xs text-[var(--color-warning-text)]">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{t("handoverConsentNotice")}</span>
          </div>

          <SaveButton
            saved={saved}
            savedLabel={t("handoverCreated")}
            saveLabel={t("handoverCreate")}
            disabled={!caseId}
            onClick={submit}
          />
        </FormCard>
      )}

      <h3 className="mb-2 text-sm font-bold text-[var(--color-text-primary)]">
        {t("handoverListTitle")}
      </h3>
      {crossBorder.loading && (
        <p className="mb-4 text-xs text-[var(--color-text-muted)]">{t("handoverLoading")}</p>
      )}
      {crossBorder.handovers.length === 0 ? (
        <EmptyState message={t("handoverNoHandovers")} />
      ) : (
        <div className="mb-6 space-y-3">
          {crossBorder.handovers.map((h) => (
            <HandoverCard
              key={h.id}
              handover={h}
              workspaceId={workspaceId}
              onAction={crossBorder.handoverAction}
            />
          ))}
        </div>
      )}

      <h3 className="mb-2 text-sm font-bold text-[var(--color-text-primary)]">
        {t("guidanceTitle")}
      </h3>
      <div className="mb-3 flex flex-wrap gap-2">
        <select
          value={guidanceOrigin}
          onChange={(e) => setGuidanceOrigin(e.target.value)}
          className="rounded-lg border border-[var(--color-border)] px-2 py-1 text-xs"
        >
          {COUNTRY_OPTIONS.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
        <span className="self-center text-xs text-[var(--color-text-muted)]">→</span>
        <select
          value={guidanceDest}
          onChange={(e) => setGuidanceDest(e.target.value)}
          className="rounded-lg border border-[var(--color-border)] px-2 py-1 text-xs"
        >
          {COUNTRY_OPTIONS.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {crossBorder.guidance.length === 0 ? (
        <EmptyState message={t("guidanceEmpty")} />
      ) : (
        <div className="space-y-3">
          {crossBorder.guidance.map((g) => (
            <div
              key={g.id}
              className="rounded-2xl border border-[var(--color-sage-200)] bg-[var(--color-surface)] p-4 shadow-1"
            >
              <h4 className="mb-2 text-sm font-bold text-[var(--color-text-primary)]">
                {t(g.titleKey.replace("operations.", ""))}
              </h4>
              <pre className="whitespace-pre-wrap font-sans text-xs text-[var(--color-text-secondary)]">
                {renderGuidanceTemplate(g.contentTemplate, {
                  origin_country: guidanceOrigin,
                  destination_country: guidanceDest,
                  preferred_language: "ro",
                })}
              </pre>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
