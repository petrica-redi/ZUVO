"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { INTAKE_HELP_TYPES } from "@/lib/operations/constants";
import type { IntakeHelpType } from "@/lib/operations/constants";
import { FormCard, SaveButton } from "@/components/mediator/parts";

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
      <div className="rounded-2xl border border-[var(--color-success-accent)] bg-[var(--color-success-bg)] p-6 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-[var(--color-success-accent)]" />
        <h2 className="mb-2 text-lg font-bold text-[var(--color-success-text)]">
          {t("helpConfirmed")}
        </h2>
        <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
          {t("helpConfirmedHint")}
        </p>
        <p className="font-mono text-xl font-extrabold text-[var(--color-text-primary)]">
          {reference}
        </p>
      </div>
    );
  }

  return (
    <FormCard>
      <div
        role="note"
        className="mb-4 flex items-start gap-2 rounded-xl border border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] p-3 text-sm text-[var(--color-warning-text)]"
      >
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>{t("emergencyWarning")}</p>
      </div>

      <label className="mb-1 block text-xs font-bold text-[var(--color-text-muted)]">
        {t("helpType")}
      </label>
      <select
        value={helpType}
        onChange={(e) => setHelpType(e.target.value as IntakeHelpType)}
        className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
      >
        {INTAKE_HELP_TYPES.map((h) => (
          <option key={h} value={h}>
            {t(`helpType_${h}`)}
          </option>
        ))}
      </select>

      <label className="mb-1 block text-xs font-bold text-[var(--color-text-muted)]">
        {t("contactMethod")}
      </label>
      <select
        value={contactMethod}
        onChange={(e) =>
          setContactMethod(
            e.target.value as "phone" | "sms" | "email" | "whatsapp" | "in_person",
          )
        }
        className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
      >
        <option value="phone">{t("contact_phone")}</option>
        <option value="sms">{t("contact_sms")}</option>
        <option value="email">{t("contact_email")}</option>
        <option value="whatsapp">{t("contact_whatsapp")}</option>
        <option value="in_person">{t("contact_in_person")}</option>
      </select>

      <input
        type="text"
        placeholder={t("contactValue")}
        value={contactValue}
        onChange={(e) => setContactValue(e.target.value)}
        className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
      />

      <textarea
        placeholder={t("helpNotes")}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
      />

      <label className="mb-4 flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1"
        />
        <span>{t("consentLabel")}</span>
      </label>

      {error && (
        <p className="mb-3 text-sm text-[var(--color-danger-text)]">{error}</p>
      )}

      <SaveButton
        saved={false}
        savedLabel=""
        saveLabel={submitting ? t("submitting") : t("submitHelp")}
        disabled={!consent || submitting}
        onClick={() => void submit()}
      />
    </FormCard>
  );
}
