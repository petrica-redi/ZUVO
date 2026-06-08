import type { Metadata } from "next";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";
import { getAppConfig } from "@/lib/env";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { REGIONS, HEALTH_INDEX_LABELS } from "@/data/regions";
import { Globe, Activity } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "regions" });
  const { appName } = getAppConfig();
  return { title: `${t("title")} — ${appName}`, description: t("subtitle") };
}

const HEALTH_COLORS = ["#DC2626", "#F97316", "#F59E0B", "#22C55E", "#16A34A"];

export default async function RegionsIndexPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "regions" });

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <SosButton />
      <main id="main-content" className="flex-1 pb-8">
        <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">

          <div className="mb-8 text-center animate-fade-in-up">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--color-surface)] shadow-1">
              <Globe className="lucide h-8 w-8 text-[var(--color-accent)]" strokeWidth={1.85} />
            </div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)] md:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base max-w-md mx-auto">
              {t("subtitle")}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 animate-fade-in-up delay-100">
            {REGIONS.map((region, i) => {
              const color = HEALTH_COLORS[region.healthIndex - 1];
              const label = HEALTH_INDEX_LABELS[region.healthIndex];
              const regionKey = region.id === "northMacedonia" ? "northMacedonia"
                : region.id === "czech" ? "czech"
                : region.id as keyof typeof t;

              return (
                <Link
                  key={region.id}
                  href={`/regions/${region.id}`}
                  className="flex items-center gap-4 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 shadow-1 transition-all hover:shadow-2 hover:border-[var(--color-border-default)] active:scale-[0.98] animate-fade-in-up"
                  style={{ animationDelay: `${i * 40 + 150}ms` }}
                >
                  <span className="text-3xl flex-shrink-0">{region.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[var(--color-text-primary)] truncate">
                      {t(regionKey as Parameters<typeof t>[0])}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Roma pop. {region.romaPopulation}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <Activity className="lucide h-3 w-3 flex-shrink-0" strokeWidth={2} style={{ color }} />
                      <span className="text-[10px] font-bold" style={{ color }}>{label}</span>
                    </div>
                  </div>
                  <span className="text-[var(--color-text-muted)] text-xs font-bold">›</span>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
