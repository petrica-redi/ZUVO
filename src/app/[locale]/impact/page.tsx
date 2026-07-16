import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAppConfig } from "@/lib/env";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import {
  ShieldCheck,
  Activity,
  Users,
  FileText,
  Mail,
  BarChart3,
  TrendingUp,
  LockKeyhole,
  MapPinned,
  Database,
} from "lucide-react";
import { Card } from "@/components/ui";
import { formatImpactNumber, getImpactStats } from "@/lib/impact/stats";

export const dynamic = "force-dynamic";
export const maxDuration = 15;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "impact" });
  const { appName } = getAppConfig();
  return { title: `${t("title")} — ${appName}`, description: t("subtitle") };
}

export default async function ImpactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "impact" });
  const stats = await getImpactStats();
  const live = stats.source === "live";
  const countyRows = stats.countySnapshots;
  const copy =
    locale === "ro"
      ? {
          eyebrow: "Tablou național · vedere minister",
          provenanceLive: "Date operaționale live",
          provenanceDemo: "Date demonstrative ilustrative",
          provenanceBodyLive: "Agregate din spațiile mediatorilor, actualizate automat.",
          provenanceBodyDemo:
            "Scenariu realist pentru demonstrație. Nu reprezintă beneficiari sau rezultate reale.",
          counties: "Acoperire pe județe",
          countiesLead: "Date agregate pentru planificare — fără nume sau dosare individuale.",
          county: "Județ",
          referrals: "Trimiteri",
          trend: "față de luna trecută",
          safeguards: "Guvernanță și protecția datelor",
          safeguard1: "Zero nume de beneficiari în această vedere",
          safeguard2: "Prag minim înainte de afișarea unui indicator",
          safeguard3: "Exporturi auditate și acces pe roluri",
          pois: "Indicatori de acces facilitați",
          poisValue: "înscrieri la medicul de familie",
          updated: "Actualizat pentru prezentarea stakeholderilor",
        }
      : {
          eyebrow: "National dashboard · ministry view",
          provenanceLive: "Live operational data",
          provenanceDemo: "Illustrative demonstration data",
          provenanceBodyLive: "Aggregated from mediator workspaces and updated automatically.",
          provenanceBodyDemo:
            "A realistic presentation scenario. It does not represent real beneficiaries or outcomes.",
          counties: "County coverage",
          countiesLead: "Aggregated planning data — no names or individual case files.",
          county: "County",
          referrals: "Referrals",
          trend: "vs last month",
          safeguards: "Governance and data safeguards",
          safeguard1: "Zero beneficiary names in this view",
          safeguard2: "Minimum threshold before an indicator is shown",
          safeguard3: "Audited exports and role-based access",
          pois: "Access indicators facilitated",
          poisValue: "GP enrolments",
          updated: "Updated for stakeholder presentation",
        };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <SosButton />
      <main id="main-content" className="flex-1 pb-8">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
          <div className="mb-8 grid items-end gap-6 md:grid-cols-[1fr_auto] animate-fade-in-up">
            <div>
              <p className="eyebrow">
                <MapPinned className="h-3.5 w-3.5" />
                {copy.eyebrow}
              </p>
              <h1 className="font-headline mt-3 text-4xl tracking-tight text-[var(--color-text-primary)] md:text-5xl">
                {t("title")}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base">
                {t("subtitle")}
              </p>
            </div>
            <div
              className={`max-w-sm rounded-2xl border px-4 py-3 ${
                live
                  ? "border-[var(--color-success-border)] bg-[var(--color-success-bg)]"
                  : "border-amber-200 bg-amber-50"
              }`}
            >
              <p className="flex items-center gap-2 text-xs font-extrabold text-[var(--color-text-primary)]">
                <Database className="h-4 w-4" />
                {live ? copy.provenanceLive : copy.provenanceDemo}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-[var(--color-text-secondary)]">
                {live ? copy.provenanceBodyLive : copy.provenanceBodyDemo}
              </p>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5 animate-fade-in-up delay-100">
            {[
              [ShieldCheck, formatImpactNumber(stats.mythsChecked), t("statMyths"), "text-[var(--color-brand-700)]"],
              [Activity, String(stats.emergenciesEscalated), t("statEmergencies"), "text-red-600"],
              [Users, String(stats.activeMediators), t("statMediators"), "text-[var(--color-ink-900)]"],
              [FileText, formatImpactNumber(stats.visitsThisYear), t("statVisits"), "text-[var(--color-brand-600)]"],
            ].map(([Icon, value, label, tone]) => {
              const StatIcon = Icon as typeof BarChart3;
              return (
                <Card key={String(label)} variant="elevated" className="p-5 md:p-6">
                  <StatIcon className={`mb-4 h-5 w-5 ${tone}`} strokeWidth={2} />
                  <div className="font-display text-3xl font-extrabold text-[var(--color-text-primary)] md:text-4xl">
                    {String(value)}
                  </div>
                  <div className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] md:text-xs">
                    {String(label)}
                  </div>
                </Card>
              );
            })}
          </div>

          {live && stats.openOpsCases > 0 ? (
            <p className="mb-8 text-xs font-semibold text-[var(--color-text-secondary)]">
              {locale === "ro"
                ? `${stats.openOpsCases} cazuri operaționale deschise în platformă (spații mediatori + flux operațional).`
                : `${stats.openOpsCases} open operational cases across mediator workspaces and the ops layer.`}
            </p>
          ) : null}

          <div className="mb-8">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-extrabold text-[var(--color-text-primary)]">
                  {t("programmeIndicators")}
                </h2>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  {t("programmeIndicatorsLead")}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ${
                  live
                    ? "bg-[var(--color-success-bg)] text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {live ? t("dataLabelLive") : t("dataLabelIllustrative")}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
              {stats.programmeIndicators.map((indicator) => {
                const labelKey = indicator.labelKey.replace(/^impact\./, "");
                return (
                <Card key={indicator.slug} variant="elevated" className="p-4 md:p-5">
                  <div className="font-display text-2xl font-extrabold text-[var(--color-text-primary)] md:text-3xl">
                    {indicator.count != null ? formatImpactNumber(indicator.count) : "—"}
                  </div>
                  <div className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    {t(labelKey)}
                  </div>
                  {indicator.suppressed && (
                    <p className="mt-2 text-[10px] text-amber-700">{t("thresholdSuppressed")}</p>
                  )}
                </Card>
                );
              })}
            </div>
          </div>

          <div className="mb-8 grid gap-5 lg:grid-cols-[1.45fr_0.55fr]">
            <Card variant="elevated" className="overflow-hidden p-0">
              <div className="border-b border-[var(--color-border-subtle)] px-6 py-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-lg font-extrabold text-[var(--color-text-primary)]">
                      {copy.counties}
                    </h2>
                    <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                      {copy.countiesLead}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--color-sage-100)] px-3 py-1 text-xs font-extrabold text-[var(--color-sage-800)]">
                    {stats.countiesReporting} {t("countiesReporting")}
                  </span>
                </div>
                {!live && (
                  <div className="mt-4 rounded-xl border border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] px-4 py-3">
                    <p className="text-xs font-bold text-[var(--color-warning-text)]">
                      {t("demoCountyTitle")}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                      {t("demoCountyLead")}
                    </p>
                  </div>
                )}
              </div>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead className="bg-[var(--color-neutral-50)] text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
                    <tr>
                      <th className="px-6 py-3 font-extrabold">{copy.county}</th>
                      <th className="px-4 py-3 font-extrabold">{t("statMediators")}</th>
                      <th className="px-4 py-3 font-extrabold">{t("statVisits")}</th>
                      <th className="px-4 py-3 font-extrabold">{copy.referrals}</th>
                      <th className="px-6 py-3 font-extrabold">{copy.trend}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {countyRows.map((row) => (
                      <tr key={row.county} className="border-t border-[var(--color-border-subtle)]">
                        <td className="px-6 py-4 font-bold text-[var(--color-text-primary)]">{row.county}</td>
                        <td className="px-4 py-4 text-[var(--color-text-secondary)]">{row.mediators}</td>
                        <td className="px-4 py-4 text-[var(--color-text-secondary)]">{row.visits}</td>
                        <td className="px-4 py-4 text-[var(--color-text-secondary)]">{row.referrals}</td>
                        <td className="px-6 py-4">
                          {row.trend != null ? (
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                              <TrendingUp className="h-3.5 w-3.5" /> +{row.trend}%
                            </span>
                          ) : (
                            <span className="text-[var(--color-text-muted)]">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="divide-y divide-[var(--color-border-subtle)] md:hidden">
                {countyRows.map((row) => (
                  <div key={row.county} className="px-5 py-4">
                    <p className="font-bold text-[var(--color-text-primary)]">{row.county}</p>
                    <dl className="mt-2 grid grid-cols-2 gap-2 text-xs text-[var(--color-text-secondary)]">
                      <div>
                        <dt className="font-semibold">{t("statMediators")}</dt>
                        <dd>{row.mediators}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">{t("statVisits")}</dt>
                        <dd>{row.visits}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">{copy.referrals}</dt>
                        <dd>{row.referrals}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">{copy.trend}</dt>
                        <dd className={row.trend != null ? "font-bold text-[var(--color-success-text)]" : ""}>
                          {row.trend != null ? `+${row.trend}%` : "—"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid gap-5">
              <Card variant="elevated" className="bg-gradient-to-br from-violet-700 to-indigo-800 p-6 text-white">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/70">
                  {copy.pois}
                </p>
                <p className="mt-4 font-display text-4xl font-extrabold">
                  {stats.gpEnrollmentsFacilitated}
                </p>
                <p className="mt-1 text-sm text-white/80">{copy.poisValue}</p>
                {live ? (
                  <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/15">
                    <div
                      className="h-full rounded-full bg-[var(--color-success-accent)]"
                      style={{
                        width: `${Math.min(100, Math.round((stats.gpEnrollmentsFacilitated / Math.max(stats.gpEnrollmentsFacilitated + 50, 1)) * 100))}%`,
                      }}
                    />
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-white/60">{copy.provenanceBodyDemo}</p>
                )}
              </Card>
              <Card variant="elevated" className="p-6">
                <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-[var(--color-text-primary)]">
                  <LockKeyhole className="h-5 w-5 text-emerald-600" />
                  {copy.safeguards}
                </h2>
                <ul className="mt-4 space-y-3 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                  {[copy.safeguard1, copy.safeguard2, copy.safeguard3].map((item) => (
                    <li key={item} className="flex gap-2">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>

          <Card variant="elevated" className="overflow-hidden border-0 gradient-brand grain-overlay text-white shadow-3 animate-fade-in-up delay-200">
            <div className="p-6 md:p-8 text-center">
              <h2 className="font-display text-2xl font-extrabold tracking-tight mb-2">
                {t("deployTitle")}
              </h2>
              <p className="text-sm text-white/85 leading-relaxed max-w-sm mx-auto mb-6">
                {t("deployDesc")}
              </p>
              <a 
                href="mailto:partnerships@redi.healthcare"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-extrabold text-[var(--color-brand-700)] shadow-2 transition-all hover:shadow-3 active:scale-[0.97]"
              >
                <Mail className="lucide h-4 w-4" strokeWidth={2} />
                {t("contactBtn")}
              </a>
            </div>
          </Card>
          <p className="mt-4 text-center text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
            {live ? t("liveNote") : copy.updated}
          </p>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
