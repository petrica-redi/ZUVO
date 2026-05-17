import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Shield, Lock, FileCheck } from "lucide-react";
import { Card } from "@/components/ui";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "methodology" });
  return { title: `${t("title")} — Sastipe`, description: t("subtitle") };
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

          <div className="space-y-6">
            <Card variant="elevated" className="p-6 animate-fade-in-up delay-100">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--color-danger-bg)] text-[var(--color-danger-accent)]">
                  <Shield className="lucide h-6 w-6" strokeWidth={1.85} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-extrabold text-[var(--color-text-primary)] mb-2">
                    {t("section1")}
                  </h2>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {t("desc1")}
                  </p>
                </div>
              </div>
            </Card>

            <Card variant="elevated" className="p-6 animate-fade-in-up delay-200">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--color-warning-bg)] text-[var(--color-warning-accent)]">
                  <Lock className="lucide h-6 w-6" strokeWidth={1.85} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-extrabold text-[var(--color-text-primary)] mb-2">
                    {t("section2")}
                  </h2>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {t("desc2")}
                  </p>
                </div>
              </div>
            </Card>

            <Card variant="elevated" className="p-6 animate-fade-in-up delay-300">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--color-info-bg)] text-[var(--color-info-accent)]">
                  <FileCheck className="lucide h-6 w-6" strokeWidth={1.85} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-extrabold text-[var(--color-text-primary)] mb-2">
                    {t("section3")}
                  </h2>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {t("desc3")}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
