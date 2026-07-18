"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Copy, Download, Stethoscope } from "lucide-react";
import type { NavigationCase } from "@/lib/operations/types";

/**
 * Structured visit pack for doctors / GP handoff — aligns with how clinicians work.
 */
export function DoctorVisitPack({
  cases,
  regionLabel,
  countryCode,
}: {
  cases: NavigationCase[];
  regionLabel: string;
  countryCode: "RO" | "IT";
}) {
  const t = useTranslations("fieldOs");
  const [selectedId, setSelectedId] = useState(cases[0]?.id ?? "");
  const [copied, setCopied] = useState(false);

  const selected = useMemo(
    () => cases.find((c) => c.id === selectedId) ?? cases[0] ?? null,
    [cases, selectedId],
  );

  const packText = useMemo(() => {
    if (!selected) return "";
    const lines = [
      t("packHeader"),
      `Country: ${countryCode}`,
      `Region: ${regionLabel || "—"}`,
      `Case ref: ${selected.caseNumber || selected.id.slice(0, 8)}`,
      `Pseudonym: ${selected.beneficiaryPseudonym}`,
      `Status: ${selected.status}`,
      `Urgency: ${selected.urgency}`,
      `Category: ${selected.categorySlug || "—"}`,
      "",
      t("packReason"),
      selected.mainProblem || selected.notes || "—",
      "",
      t("packBarriers"),
      (selected.barriers || []).join(", ") || "—",
      "",
      t("packConsent"),
      selected.consentStatus || "unknown",
      "",
      t("packNext"),
      selected.nextAction || "—",
      "",
      t("packDisclaimer"),
    ];
    return lines.join("\n");
  }, [selected, countryCode, regionLabel, t]);

  if (cases.length === 0) {
    return (
      <div className="platform-glass-panel">
        <p className="text-sm font-semibold text-[var(--color-text-secondary)]">
          {t("packEmpty")}
        </p>
      </div>
    );
  }

  async function copyPack() {
    if (!packText) return;
    await navigator.clipboard.writeText(packText).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function downloadPack() {
    const blob = new Blob([packText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `redi-visit-pack-${selected?.caseNumber || "case"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="platform-glass-panel mb-6" aria-labelledby="visit-pack-title">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-accent)] text-white">
          <Stethoscope className="h-4 w-4" />
        </span>
        <div>
          <h2
            id="visit-pack-title"
            className="text-sm font-extrabold text-[var(--color-text-primary)]"
          >
            {t("packTitle")}
          </h2>
          <p className="text-xs font-medium text-[var(--color-text-secondary)]">
            {t("packLead")}
          </p>
        </div>
      </div>

      <label className="mb-3 block text-xs font-bold text-[var(--color-text-secondary)]">
        {t("packSelectCase")}
        <select
          value={selected?.id ?? ""}
          onChange={(e) => setSelectedId(e.target.value)}
          className="mt-1 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface)] px-3 py-2.5 text-sm font-semibold"
        >
          {cases.map((c) => (
            <option key={c.id} value={c.id}>
              {c.caseNumber} — {c.beneficiaryPseudonym} ({c.status})
            </option>
          ))}
        </select>
      </label>

      <pre className="mb-3 max-h-48 overflow-auto whitespace-pre-wrap rounded-xl bg-[var(--color-surface-subtle)] p-3 text-xs font-medium leading-relaxed text-[var(--color-text-primary)]">
        {packText}
      </pre>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={() => void copyPack()} className="platform-cta-primary">
          <Copy className="h-4 w-4" />
          {copied ? t("packCopied") : t("packCopy")}
        </button>
        <button type="button" onClick={downloadPack} className="platform-cta-secondary">
          <Download className="h-4 w-4" />
          {t("packDownload")}
        </button>
      </div>
    </section>
  );
}
