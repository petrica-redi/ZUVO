import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { MisinfoScanner } from "@/components/MisinfoScanner";
import { AppShell, ScreenMain } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "scan" });
  return {
    title: `${t("title")} — Sastipe`,
    description: t("subtitle"),
  };
}

export default async function ScanPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "scan" });
  const tLegal = await getTranslations({ locale, namespace: "legal" });

  const labels = {
    legalTitle: tLegal("aiEducationalTitle"),
    legalBody: tLegal("aiEducationalBody"),
    claimTextareaAria: t("claimTextareaAria"),
    placeholder: t("placeholder"),
    checkButton: t("checkButton"),
    checking: t("checking"),
    shareButton: t("shareButton"),
    recentChecks: t("recentChecks"),
    orDescribe: t("orDescribe"),
    verdictVerified: t("verdictVerified"),
    verdictMisleading: t("verdictMisleading"),
    verdictFalse: t("verdictFalse"),
  };

  return (
    <AppShell>
      <Header />
      <SosButton />
      <ScreenMain>
        <div className="px-5 py-6">
          <PageHeader eyebrow={t("pageEyebrow")} title={t("title")} subtitle={t("subtitle")} />
          <MisinfoScanner labels={labels} locale={locale} />
        </div>
      </ScreenMain>
      <BottomNav />
    </AppShell>
  );
}
