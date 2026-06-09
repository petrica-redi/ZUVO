import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAppConfig } from "@/lib/env";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { FileText } from "lucide-react";
import { Card } from "@/components/ui";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { appName } = getAppConfig();
  return {
    title: `Terms of Service — ${appName}`,
    description: `Terms of service for ${appName}`,
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <main id="main-content" className="flex-1 pb-8">
        <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
          <div className="mb-8 text-center animate-fade-in-up">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--color-surface)] shadow-1">
              <FileText className="lucide h-8 w-8 text-[var(--color-text-secondary)]" strokeWidth={1.85} />
            </div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)] md:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">{t("lastUpdated")}</p>
          </div>

          <div className="space-y-4">
            {(["acceptance","service","notMedical","aiLimits","userConduct","data","liability","changes","contact"] as const).map((key) => (
              <Card key={key} variant="default">
                <div className="p-5">
                  <h2 className="mb-2 text-base font-extrabold text-[var(--color-text-primary)]">
                    {t(`sections.${key}.title`)}
                  </h2>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {t(`sections.${key}.body`)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
