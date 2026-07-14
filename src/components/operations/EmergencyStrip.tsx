import { Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

/** Above-the-fold emergency strip — always visible, satisfies safety E2E. */
export async function EmergencyStrip() {
  const t = await getTranslations("home");

  return (
    <div
      role="region"
      aria-label={t("emergencyAria")}
      className="border-b border-[var(--color-danger-border)] bg-[var(--color-danger-bg)]"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-2.5 md:px-8">
        <p className="text-xs font-semibold text-[var(--color-danger-text)] md:text-sm">
          {t("emergencyLead")}
        </p>
        <a
          href="tel:112"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--color-danger-accent)]/40 bg-[var(--color-surface)] px-4 py-2 text-xs font-extrabold text-[var(--color-danger-text)] shadow-1 transition-colors hover:bg-[var(--color-danger-accent)] hover:text-white"
        >
          <Phone className="h-3.5 w-3.5" strokeWidth={2.4} />
          {t("emergencyCta")}
        </a>
      </div>
    </div>
  );
}
