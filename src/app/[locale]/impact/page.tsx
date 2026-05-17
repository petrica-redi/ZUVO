import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ShieldCheck, Activity, Users, FileText, Mail, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "impact" });
  return { title: `${t("title")} — Sastipe`, description: t("subtitle") };
}

export default async function ImpactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "impact" });

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <main id="main-content" className="flex-1 pb-8">
        <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
          <div className="mb-8 text-center animate-fade-in-up">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl gradient-brand grain-overlay shadow-brand">
              <BarChart3 className="lucide h-8 w-8 text-white" strokeWidth={1.85} />
            </div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)] md:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base max-w-md mx-auto">
              {t("subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10 animate-fade-in-up delay-100">
            <Card variant="elevated" className="p-5 text-center">
              <ShieldCheck className="lucide h-6 w-6 mx-auto mb-2 text-[var(--color-success-accent)]" strokeWidth={2} />
              <div className="font-display text-3xl font-extrabold text-[var(--color-text-primary)]">12.4k</div>
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mt-1">{t("statMyths")}</div>
            </Card>
            <Card variant="elevated" className="p-5 text-center">
              <Activity className="lucide h-6 w-6 mx-auto mb-2 text-[var(--color-danger-accent)]" strokeWidth={2} />
              <div className="font-display text-3xl font-extrabold text-[var(--color-text-primary)]">850</div>
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mt-1">{t("statEmergencies")}</div>
            </Card>
            <Card variant="elevated" className="p-5 text-center">
              <Users className="lucide h-6 w-6 mx-auto mb-2 text-[var(--color-info-accent)]" strokeWidth={2} />
              <div className="font-display text-3xl font-extrabold text-[var(--color-text-primary)]">45</div>
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mt-1">{t("statMediators")}</div>
            </Card>
            <Card variant="elevated" className="p-5 text-center">
              <FileText className="lucide h-6 w-6 mx-auto mb-2 text-[var(--color-ember-500)]" strokeWidth={2} />
              <div className="font-display text-3xl font-extrabold text-[var(--color-text-primary)]">3.2k</div>
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mt-1">{t("statVisits")}</div>
            </Card>
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
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
