import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAppConfig } from "@/lib/env";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Shield, Lock, FileCheck, BookOpen, Globe, Users, AlertTriangle, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui";
import { Link } from "@/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "methodology" });
  const { appName } = getAppConfig();
  return { title: `${t("title")} — ${appName}`, description: t("subtitle") };
}

export default async function MethodologyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "methodology" });

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <main id="main-content" className="flex-1 pb-8">
        <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
          <div className="mb-10 text-center animate-fade-in-up">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--color-surface)] shadow-1">
              <Shield className="lucide h-8 w-8 text-[var(--color-success-accent)]" strokeWidth={1.85} />
            </div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)] md:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base max-w-md mx-auto">
              {t("subtitle")}
            </p>
          </div>

          <div className="space-y-5">
            {[
              { key: "1", Icon: Shield, colorBg: "bg-[var(--color-danger-bg)]", colorFg: "text-[var(--color-danger-accent)]", delay: "delay-100" },
              { key: "2", Icon: Lock, colorBg: "bg-[var(--color-warning-bg)]", colorFg: "text-[var(--color-warning-accent)]", delay: "delay-150" },
              { key: "3", Icon: FileCheck, colorBg: "bg-[var(--color-info-bg)]", colorFg: "text-[var(--color-info-accent)]", delay: "delay-200" },
              { key: "4", Icon: BookOpen, colorBg: "bg-[var(--color-success-bg)]", colorFg: "text-[var(--color-success-accent)]", delay: "delay-250" },
              { key: "5", Icon: Globe, colorBg: "bg-[var(--color-surface-subtle)]", colorFg: "text-[var(--color-text-secondary)]", delay: "delay-300" },
              { key: "6", Icon: Users, colorBg: "bg-[var(--color-brand-bg,var(--color-surface-subtle))]", colorFg: "text-[var(--color-brand-accent,var(--color-accent))]", delay: "delay-350" },
            ].map(({ key, Icon, colorBg, colorFg, delay }) => (
              <Card key={key} variant="elevated" className={`p-6 animate-fade-in-up ${delay}`}>
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${colorBg} ${colorFg}`}>
                    <Icon className="lucide h-6 w-6" strokeWidth={1.85} />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-extrabold text-[var(--color-text-primary)] mb-2">
                      {t(`section${key}`)}
                    </h2>
                    <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      {t(`desc${key}`)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}

            {/* Feature release policy — go / no-go */}
            <Card variant="elevated" className="p-6 animate-fade-in-up delay-400 border border-amber-200 bg-amber-50">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <AlertTriangle className="lucide h-6 w-6" strokeWidth={1.85} />
                </div>
                <div>
                  <h2 className="font-display text-lg font-extrabold text-amber-900 mb-2">
                    {t("goNoGoTitle")}
                  </h2>
                  <p className="text-sm leading-relaxed text-amber-800">
                    {t("goNoGoBody")}
                  </p>
                </div>
              </div>
            </Card>

            {/* Link to full policy documents */}
            <Link
              href="/policies"
              className="flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface)] px-5 py-4 text-sm font-bold text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors animate-fade-in-up delay-450"
            >
              <Shield className="lucide h-4 w-4 text-[var(--color-success-accent)]" strokeWidth={1.85} />
              {t("viewPolicies")}
              <ExternalLink className="lucide h-4 w-4 text-[var(--color-text-muted)]" strokeWidth={1.75} />
            </Link>

            {/* Not-a-medical-device disclaimer */}
            <p className="text-center text-xs text-[var(--color-text-muted)] leading-relaxed px-4 pt-2 animate-fade-in-up delay-500">
              {t("notMedicalDevice")}
            </p>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
