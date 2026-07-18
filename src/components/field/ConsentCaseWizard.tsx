"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, ShieldCheck, X } from "lucide-react";

export type ConsentCaseDraft = {
  beneficiaryLabel: string;
  purpose: "care_navigation" | "literacy" | "referral";
  verbalConsent: boolean;
  notes: string;
};

/**
 * Consent-first case open — Art. 9 aligned gate before storing health notes.
 */
export function ConsentCaseWizard({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (draft: ConsentCaseDraft) => void | Promise<void>;
}) {
  const t = useTranslations("fieldOs");
  const [beneficiaryLabel, setBeneficiaryLabel] = useState("");
  const [purpose, setPurpose] =
    useState<ConsentCaseDraft["purpose"]>("care_navigation");
  const [verbalConsent, setVerbalConsent] = useState(false);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  async function submit() {
    if (!beneficiaryLabel.trim() || !verbalConsent || busy) return;
    setBusy(true);
    try {
      await onConfirm({
        beneficiaryLabel: beneficiaryLabel.trim(),
        purpose,
        verbalConsent,
        notes: notes.trim(),
      });
      setBeneficiaryLabel("");
      setNotes("");
      setVerbalConsent(false);
      setPurpose("care_navigation");
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-[rgba(30,16,53,0.45)] p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-case-title"
    >
      <div className="platform-glass-panel w-full max-w-lg !p-5 shadow-4 animate-scale-in">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--color-accent-text)]">
              {t("consentEyebrow")}
            </p>
            <h2
              id="consent-case-title"
              className="font-headline mt-1 text-xl text-[var(--color-text-primary)]"
            >
              {t("consentTitle")}
            </h2>
            <p className="mt-1 text-sm font-medium text-[var(--color-text-secondary)]">
              {t("consentLead")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]"
            aria-label={t("close")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <label className="mb-3 block text-xs font-bold text-[var(--color-text-secondary)]">
          {t("consentBeneficiary")}
          <input
            value={beneficiaryLabel}
            onChange={(e) => setBeneficiaryLabel(e.target.value)}
            placeholder={t("consentBeneficiaryPlaceholder")}
            className="mt-1 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface)] px-3 py-2.5 text-sm font-semibold text-[var(--color-text-primary)]"
          />
        </label>

        <label className="mb-3 block text-xs font-bold text-[var(--color-text-secondary)]">
          {t("consentPurpose")}
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value as ConsentCaseDraft["purpose"])}
            className="mt-1 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface)] px-3 py-2.5 text-sm font-semibold text-[var(--color-text-primary)]"
          >
            <option value="care_navigation">{t("purposeCare")}</option>
            <option value="literacy">{t("purposeLiteracy")}</option>
            <option value="referral">{t("purposeReferral")}</option>
          </select>
        </label>

        <label className="mb-3 block text-xs font-bold text-[var(--color-text-secondary)]">
          {t("consentNotes")}
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder={t("consentNotesPlaceholder")}
            className="mt-1 w-full resize-none rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface)] px-3 py-2.5 text-sm font-medium text-[var(--color-text-primary)]"
          />
        </label>

        <label className="mb-5 flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-accent-soft)]/40 p-3">
          <input
            type="checkbox"
            checked={verbalConsent}
            onChange={(e) => setVerbalConsent(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
          />
          <span className="text-sm font-semibold leading-relaxed text-[var(--color-text-primary)]">
            <ShieldCheck className="mr-1 inline h-4 w-4 text-[var(--color-accent-text)]" />
            {t("consentCheckbox")}
          </span>
        </label>

        <div className="flex gap-2">
          <button type="button" onClick={onClose} className="platform-cta-secondary">
            {t("cancel")}
          </button>
          <button
            type="button"
            onClick={() => void submit()}
            disabled={!beneficiaryLabel.trim() || !verbalConsent || busy}
            className="platform-cta-primary disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            {busy ? t("saving") : t("consentConfirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
