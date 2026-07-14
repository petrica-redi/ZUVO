import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAppConfig } from "@/lib/env";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { ConsultWorkspace } from "@/components/clinician/ConsultWorkspace";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "consult" });
  const { appName } = getAppConfig();
  return {
    title: `${t("heroTitle")} — ${appName}`,
    description: t("heroSubtitle"),
  };
}

export default async function ConsultPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <SosButton />
      <main id="main-content" className="flex-1 pb-2">
        <ConsultWorkspace locale={locale} />
      </main>
      <BottomNav />
    </div>
  );
}
