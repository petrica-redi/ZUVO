import { Link } from "@/navigation";
import { LogoWordmark } from "@/components/Logo";
import { getTranslations } from "next-intl/server";

/**
 * Editorial footer for the marketing surface.
 *
 * Three columns on desktop: brand + tagline, product links, company links.
 * Stacks gracefully on mobile. Hairline divider, generous white space.
 */
export async function LandingFooter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "footer" });

  return (
    <footer className="mt-12 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-5 py-12 md:mt-24 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <LogoWordmark iconSize={32} />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {t("tagline")}
            </p>
            <p className="mt-3 text-xs text-[var(--color-text-muted)]">{t("builtWith")}</p>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
              {t("product")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/students"
                  className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  {t("forStudents")}
                </Link>
              </li>
              <li>
                <Link
                  href="/providers"
                  className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  {t("forCommunity")}
                </Link>
              </li>
              <li>
                <Link
                  href="/impact"
                  className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  {t("forMinisters")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
              {t("company")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/methodology"
                  className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  {t("methodology")}
                </Link>
              </li>
              <li>
                <Link
                  href="/impact"
                  className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  {t("impact")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@redi.healthcare"
                  className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  {t("contact")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="divider-soft my-10" />

        <div className="flex flex-col items-start justify-between gap-3 text-xs text-[var(--color-text-muted)] md:flex-row md:items-center">
          <span>{t("rights")}</span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            {t("systemsOperational")}
          </span>
        </div>
      </div>
    </footer>
  );
}
