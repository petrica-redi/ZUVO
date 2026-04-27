import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { MisinfoScanner } from "@/components/MisinfoScanner";

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
    title: t("title"),
    subtitle: t("subtitle"),
    legalTitle: tLegal("aiEducationalTitle"),
    legalBody: tLegal("aiEducationalBody"),
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
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F7]">
      <Header />
      <SosButton />
      <main id="main-content" className="flex-1 pb-2">
        <div className="px-5 py-6">
          <MisinfoScanner labels={labels} locale={locale} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
