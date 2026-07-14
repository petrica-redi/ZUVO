"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FolderOpen, Plus, ChevronDown, ChevronUp } from "lucide-react";
import {
  BARRIER_SLUGS,
  CASE_STATUSES,
  CASE_URGENCIES,
  CATEGORY_SLUGS,
  STATUS_LABEL_KEYS,
  URGENCY_LABEL_KEYS,
  type AttendanceOutcome,
  type BarrierSlug,
  type CaseStatus,
  type CaseUrgency,
  type CategorySlug,
} from "@/lib/operations/constants";
import type {
  NavigationCase,
  OperationalProvider,
  Referral,
  Appointment,
} from "@/lib/operations/types";
import type {
  CreateCaseInput,
  CreateReferralInput,
  CreateAppointmentInput,
} from "@/lib/operations/types";
import { suggestTasksForBarriers } from "@/lib/operations/barrier-suggestions";
import { getDefaultMunicipality } from "@/lib/operations/operations-client";
import { EmergencyBanner } from "@/components/operations/EmergencyBanner";
import {
  StatusBadge,
  caseStatusTone,
  urgencyTone,
} from "@/components/operations/StatusBadge";
import { TimelineStrip } from "@/components/operations/TimelineStrip";
import { FormCard, SaveButton } from "./parts";
import { ProviderSearchPanel } from "./ProviderSearchPanel";
import { ReferralPanel } from "./ReferralPanel";

function toggle<T>(set: T[], value: T): T[] {
  return set.includes(value) ? set.filter((x) => x !== value) : [...set, value];
}

const fieldClass =
  "min-h-[44px] w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-sage-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-200)]";

export function OperationalCasesTab({
  cases,
  referrals,
  appointments,
  onCreateCase,
  onUpdateStatus,
  onCreateReferral,
  onCreateAppointment,
  onConfirmAppointment,
  onRecordAttendance,
  onRefreshProviderData,
}: {
  cases: NavigationCase[];
  referrals: Referral[];
  appointments: Appointment[];
  onCreateCase: (input: CreateCaseInput) => Promise<NavigationCase>;
  onUpdateStatus: (caseId: string, status: CaseStatus) => Promise<void>;
  onCreateReferral: (input: CreateReferralInput) => Promise<Referral | null>;
  onCreateAppointment: (input: CreateAppointmentInput) => Promise<Appointment | null>;
  onConfirmAppointment: (appointmentId: string) => Promise<void>;
  onRecordAttendance: (
    appointmentId: string,
    outcome: AttendanceOutcome,
    followUpRequired: boolean,
    notes?: string,
  ) => Promise<void>;
  onRefreshProviderData: (caseId: string) => Promise<void>;
}) {
  const t = useTranslations("operations");
  const [open, setOpen] = useState(false);
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<OperationalProvider | null>(null);
  const [pseudonym, setPseudonym] = useState("");
  const [category, setCategory] = useState<CategorySlug>("other");
  const [mainProblem, setMainProblem] = useState("");
  const [urgency, setUrgency] = useState<CaseUrgency>("routine");
  const [notes, setNotes] = useState("");
  const [barriers, setBarriers] = useState<BarrierSlug[]>([]);
  const [barrierNotes, setBarrierNotes] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [saved, setSaved] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const phaseLabels = {
    intake: t("timelineIntake"),
    assess: t("timelineAssess"),
    access: t("timelineAccess"),
    coordination: t("timelineCoordination"),
    resolved: t("timelineResolved"),
  };

  const reset = () => {
    setPseudonym("");
    setCategory("other");
    setMainProblem("");
    setUrgency("routine");
    setNotes("");
    setBarriers([]);
    setBarrierNotes("");
    setTargetDate("");
    setSuggestions([]);
  };

  const onBarriersChange = (next: BarrierSlug[]) => {
    setBarriers(next);
    const tasks = suggestTasksForBarriers(next);
    setSuggestions(tasks.map((task) => t(`taskType_${task}`)));
  };

  const submit = async () => {
    if (!pseudonym.trim() || !mainProblem.trim()) return;
    await onCreateCase({
      beneficiaryPseudonym: pseudonym.trim(),
      categorySlug: category,
      mainProblem: mainProblem.trim(),
      urgency,
      notes: notes.trim(),
      barriers,
      barrierNotes: barrierNotes.trim() || undefined,
      targetDate: targetDate || undefined,
      municipalityCode: getDefaultMunicipality(),
      source: "mediator_dashboard",
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setOpen(false);
      reset();
    }, 1500);
  };

  const toggleCase = (caseId: string) => {
    if (expandedCaseId === caseId) {
      setExpandedCaseId(null);
      setSelectedProvider(null);
    } else {
      setExpandedCaseId(caseId);
      setSelectedProvider(null);
      void onRefreshProviderData(caseId);
    }
  };

  const handleSelectProvider = (navCase: NavigationCase, provider: OperationalProvider) => {
    setSelectedProvider(provider);
    if (navCase.status === "assessment" || navCase.status === "action_required") {
      void onUpdateStatus(navCase.id, "provider_search");
    }
  };

  const openCount = cases.filter(
    (c) => !["completed", "closed_incomplete", "cancelled"].includes(c.status),
  ).length;

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
            {t("casesTitle")}
          </h2>
          {cases.length > 0 && (
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
              {t("casesOpenCount", { count: openCount })}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-[var(--color-sage-700)] px-4 py-2.5 text-xs font-extrabold text-white shadow-1 transition-transform active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" aria-hidden />
          {t("openCase")}
        </button>
      </div>

      {open && (
        <FormCard>
          <h3 className="mb-4 text-base font-bold text-[var(--color-text-primary)]">
            {t("openCase")}
          </h3>

          <label className="mb-1 block text-xs font-bold text-[var(--color-text-muted)]">
            {t("beneficiaryPseudonym")}
          </label>
          <input
            type="text"
            placeholder={t("beneficiaryPseudonym")}
            value={pseudonym}
            onChange={(e) => setPseudonym(e.target.value)}
            aria-label={t("beneficiaryPseudonym")}
            className={`mb-3 ${fieldClass}`}
          />

          <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-[var(--color-text-muted)]">
                {t("category")}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategorySlug)}
                aria-label={t("category")}
                className={fieldClass}
              >
                {CATEGORY_SLUGS.map((c) => (
                  <option key={c} value={c}>
                    {t(`category_${c}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[var(--color-text-muted)]">
                {t("urgency")}
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as CaseUrgency)}
                aria-label={t("urgency")}
                className={fieldClass}
              >
                {CASE_URGENCIES.map((u) => (
                  <option key={u} value={u}>
                    {t(URGENCY_LABEL_KEYS[u].replace("operations.", ""))}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {urgency === "emergency" && (
            <EmergencyBanner
              message={t("emergencyWarning")}
              callLabel={t("emergencyCall")}
              variant="danger"
              className="mb-4"
            />
          )}

          <label className="mb-1 block text-xs font-bold text-[var(--color-text-muted)]">
            {t("mainProblem")}
          </label>
          <input
            type="text"
            placeholder={t("mainProblem")}
            value={mainProblem}
            onChange={(e) => setMainProblem(e.target.value)}
            aria-label={t("mainProblem")}
            className={`mb-3 ${fieldClass}`}
          />

          <fieldset className="mb-3 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-sage-50)]/50 p-3">
            <legend className="px-1 text-[11px] font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
              {t("barriersLabel")}
            </legend>
            <div className="flex flex-wrap gap-2">
              {BARRIER_SLUGS.map((b) => {
                const active = barriers.includes(b);
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => onBarriersChange(toggle(barriers, b))}
                    aria-pressed={active}
                    className={`min-h-[36px] rounded-full border px-3 py-1.5 text-[11px] font-bold transition-colors ${
                      active
                        ? "border-[var(--color-sage-600)] bg-[var(--color-sage-100)] text-[var(--color-sage-800)]"
                        : "border-[var(--color-border-default)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]"
                    }`}
                  >
                    {t(`barrier_${b}`)}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {suggestions.length > 0 && (
            <div className="mb-3 rounded-xl border border-[var(--color-info-border)] bg-[var(--color-info-bg)] px-3 py-2 text-xs text-[var(--color-info-text)]">
              <span className="font-bold">{t("suggestedActions")}:</span>{" "}
              {suggestions.join(", ")}
            </div>
          )}

          <label className="mb-1 block text-xs font-bold text-[var(--color-text-muted)]">
            {t("barrierNotes")}
          </label>
          <textarea
            placeholder={t("barrierNotes")}
            value={barrierNotes}
            onChange={(e) => setBarrierNotes(e.target.value)}
            aria-label={t("barrierNotes")}
            rows={2}
            className={`mb-3 ${fieldClass} min-h-[72px]`}
          />

          <label className="mb-1 block text-xs font-bold text-[var(--color-text-muted)]">
            {t("targetDate")}
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            aria-label={t("targetDate")}
            className={`mb-3 ${fieldClass}`}
          />

          <label className="mb-1 block text-xs font-bold text-[var(--color-text-muted)]">
            {t("notes")}
          </label>
          <textarea
            placeholder={t("notes")}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            aria-label={t("notes")}
            rows={3}
            className={`mb-4 ${fieldClass} min-h-[88px]`}
          />

          <SaveButton
            saved={saved}
            savedLabel={t("caseSaved")}
            saveLabel={t("saveCase")}
            disabled={!pseudonym.trim() || !mainProblem.trim()}
            onClick={() => void submit()}
          />
        </FormCard>
      )}

      {cases.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-sage-200)] bg-[var(--color-surface)] p-8 text-center shadow-1">
          <FolderOpen
            className="mx-auto mb-3 h-10 w-10 text-[var(--color-sage-400)]"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="mb-1 text-sm font-semibold text-[var(--color-text-primary)]">
            {t("emptyCasesTitle")}
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">{t("noCases")}</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {cases.map((c) => {
            const expanded = expandedCaseId === c.id;
            const showProviderFlow = [
              "provider_search",
              "appointment_requested",
              "appointment_confirmed",
              "referred",
              "follow_up",
              "action_required",
              "assessment",
            ].includes(c.status);

            return (
            <li
              key={c.id}
              className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 shadow-1"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="font-bold text-[var(--color-text-primary)]">
                    {c.beneficiaryPseudonym}
                  </span>
                  <p className="font-mono text-[10px] text-[var(--color-text-muted)]">
                    {c.caseNumber}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge
                    label={t(
                      URGENCY_LABEL_KEYS[c.urgency].replace("operations.", ""),
                    )}
                    tone={urgencyTone(c.urgency)}
                  />
                  {showProviderFlow && (
                    <button
                      type="button"
                      onClick={() => toggleCase(c.id)}
                      aria-expanded={expanded}
                      aria-label={t("providerAccess")}
                      className="rounded-full p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-sage-50)]"
                    >
                      {expanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <TimelineStrip
                status={c.status}
                phaseLabels={phaseLabels}
                ariaLabel={t("timelineAriaLabel")}
                className="mb-3"
              />

              <div className="mb-2 flex flex-wrap items-center gap-2">
                <StatusBadge
                  label={t(
                    STATUS_LABEL_KEYS[c.status].replace("operations.", ""),
                  )}
                  tone={caseStatusTone(c.status)}
                  size="sm"
                />
                <span className="text-xs text-[var(--color-text-muted)]">
                  {t(`category_${c.categorySlug}`)}
                </span>
              </div>

              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {c.mainProblem}
              </p>

              {c.urgency === "emergency" && (
                <EmergencyBanner
                  message={t("emergencyWarning")}
                  callLabel={t("emergencyCall")}
                  variant="danger"
                  className="mt-3"
                />
              )}

              {c.nextAction && (
                <p className="mt-2 rounded-lg bg-[var(--color-sage-50)] px-3 py-2 text-xs text-[var(--color-sage-800)]">
                  <span className="font-bold">{t("nextAction")}:</span>{" "}
                  {c.nextAction.startsWith("operations.")
                    ? t(c.nextAction.replace("operations.", ""))
                    : c.nextAction}
                </p>
              )}

              {(c.barriers?.length ?? 0) > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {c.barriers.map((b) => (
                    <StatusBadge
                      key={b}
                      label={t(`barrier_${b}`)}
                      tone="warning"
                      size="sm"
                    />
                  ))}
                </div>
              )}

              {c.status !== "completed" && c.status !== "cancelled" && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--color-border-subtle)] pt-3">
                  <span className="w-full text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    {t("updateStatus")}
                  </span>
                  {CASE_STATUSES.filter((s) => s !== c.status)
                    .slice(0, 4)
                    .map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => void onUpdateStatus(c.id, s)}
                        className="min-h-[40px] rounded-full border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-3 py-2 text-[11px] font-bold text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-sage-400)] hover:bg-[var(--color-sage-50)] active:scale-[0.98]"
                      >
                        →{" "}
                        {t(STATUS_LABEL_KEYS[s].replace("operations.", ""))}
                      </button>
                    ))}
                </div>
              )}

              {expanded && showProviderFlow && (
                <div className="mt-4 flex flex-col gap-4 border-t border-[var(--color-border-subtle)] pt-4">
                  <ProviderSearchPanel
                    navCase={c}
                    onSelectProvider={(p) => handleSelectProvider(c, p)}
                    selectedProviderId={
                      expandedCaseId === c.id ? selectedProvider?.id : undefined
                    }
                  />
                  {expandedCaseId === c.id && selectedProvider && (
                    <ReferralPanel
                      navCase={c}
                      provider={selectedProvider}
                      referrals={referrals}
                      appointments={appointments}
                      onCreateReferral={onCreateReferral}
                      onCreateAppointment={onCreateAppointment}
                      onConfirmAppointment={onConfirmAppointment}
                      onRecordAttendance={onRecordAttendance}
                    />
                  )}
                </div>
              )}
            </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
