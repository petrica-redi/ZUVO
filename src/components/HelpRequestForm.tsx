"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Loader2, Shield } from "lucide-react";
import { INTAKE_HELP_TYPES } from "@/lib/operations/constants";
import type { IntakeHelpType } from "@/lib/operations/constants";
import { EmergencyBanner } from "@/components/operations/EmergencyBanner";
import { FormCard, SaveButton } from "@/components/mediator/parts";

const fieldClass =
  "min-h-[44px] w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-sage-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-200)]";

export function HelpRequestForm() {
  const t = useTranslations("operations");
  const [helpType, setHelpType] = useState<IntakeHelpType>("mediator_help");
  const [contactMethod, setContactMethod] = useState<
    "phone" | "sms" | "email" | "whatsapp" | "in_person"
  >("phone");
  const [contactValue, setContactValue] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!consent) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/operations/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          helpType,
          contactMethod,
          contactValue: contactValue.trim() || undefined,
          consentGranted: true,
          notes: notes.trim() || undefined,
          preferredLanguage: document.documentElement.lang?.slice(0, 2) || "ro",
        }),
      });
      const json = (await res.json()) as {
        success?: boolean;
        data?: { referenceCode: string };
        error?: string;
      };
      if (!res.ok || !json.success) {
        setError(json.error ?? t("submitError"));
        return;
      }
      setReference(json.data?.referenceCode ?? null);
    } catch {
      setError(t("submitError"));
    } finally {
      setSubmitting(false);
    }
  };

  if (reference) {
    return (
      <div className="rounded-2xl border border-[var(--color-success-accent)] bg-[var(--color-success-bg)] p-6 text-center shadow-1">
        <CheckCircle2
          className="mx-auto mb-3 h-12 w-12 text-[var(--color-success-accent)]"
          aria-hidden
        />
        <h2 className="mb-2 text-lg font-bold text-[var(--color-success-text)]">
          {t("helpConfirmed")}
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {t("helpConfirmedHint")}
        </p>
        <div className="rounded-xl border border-[var(--color-success-accent)] bg-[var(--color-surface)] px-4 py-3">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            {t("referenceLabel")}
          </p>
          <p className="font-mono text-2xl font-extrabold tracking-wider text-[var(--color-text-primary)]">
            {reference}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <EmergencyBanner
        message={t("emergencyWarning")}
        callLabel={t("emergencyCall")}
        variant="warning"
      />

      <div className="flex items-start gap-3 rounded-2xl border border-[var(--color-sage-200)] bg-[var(--color-sage-50)] p-4">
        <Shield
          className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-sage-700)]"
          aria-hidden
        />
        <p className="text-sm leading-relaxed text-[var(--color-sage-800)]">
          {t("helpPageTrustNote")}
        </p>
      </div>

      <FormCard>
        <label
          htmlFor="help-type"
          className="mb-1 block text-xs font-bold text-[var(--color-text-muted)]"
        >
          {t("helpType")}
        </label>
        <select
          id="help-type"
          value={helpType}
          onChange={(e) => setHelpType(e.target.value as IntakeHelpType)}
          className={`mb-4 ${fieldClass}`}
        >
          {INTAKE_HELP_TYPES.map((h) => (
            <option key={h} value={h}>
              {t(`helpType_${h}`)}
            </option>
          ))}
        </select>

        <label
          htmlFor="contact-method"
          className="mb-1 block text-xs font-bold text-[var(--color-text-muted)]"
        >
          {t("contactMethod")}
        </label>
        <select
          id="contact-method"
          value={contactMethod}
          onChange={(e) =>
            setContactMethod(
              e.target.value as
                | "phone"
                | "sms"
                | "email"
                | "whatsapp"
                | "in_person",
            )
          }
          className={`mb-4 ${fieldClass}`}
        >
          <option value="phone">{t("contact_phone")}</option>
          <option value="sms">{t("contact_sms")}</option>
          <option value="email">{t("contact_email")}</option>
          <option value="whatsapp">{t("contact_whatsapp")}</option>
          <option value="in_person">{t("contact_in_person")}</option>
        </select>

        <label
          htmlFor="contact-value"
          className="mb-1 block text-xs font-bold text-[var(--color-text-muted)]"
        >
          {t("contactValue")}
        </label>
        <input
          id="contact-value"
          type="text"
          placeholder={t("contactValue")}
          value={contactValue}
          onChange={(e) => setContactValue(e.target.value)}
          className={`mb-4 ${fieldClass}`}
        />

        <label
          htmlFor="help-notes"
          className="mb-1 block text-xs font-bold text-[var(--color-text-muted)]"
        >
          {t("helpNotes")}
        </label>
        <textarea
          id="help-notes"
          placeholder={t("helpNotes")}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className={`mb-4 ${fieldClass} min-h-[88px]`}
        />

        <label className="mb-4 flex min-h-[44px] items-start gap-3 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] p-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-sage-700)]"
          />
          <span>{t("consentLabel")}</span>
        </label>

        {error && (
          <p
            role="alert"
            className="mb-3 rounded-xl border border-[var(--color-danger-border)] bg-[var(--color-danger-bg)] px-3 py-2 text-sm text-[var(--color-danger-text)]"
          >
            {error}
          </p>
        )}

        {submitting ? (
          <div
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[var(--color-sage-700)] text-sm font-semibold text-white"
            role="status"
            aria-live="polite"
          >
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            {t("submitting")}
          </div>
        ) : (
          <SaveButton
            saved={false}
            savedLabel=""
            saveLabel={t("submitHelp")}
            disabled={!consent || submitting}
            onClick={() => void submit()}
          />
        )}
      </FormCard>
    </div>
  );
}
