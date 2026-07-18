import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { PrescriptionExplainer } from "@/components/PrescriptionExplainer";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "explain.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function ExplainPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "explain" });

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#EDE6F8]">
      <Header />
      <SosButton />
      <main id="main-content" className="flex-1 pb-2">
        <div className="px-4 py-4 sm:px-5 sm:py-5">
          <div className="mb-3 rounded-2xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-900 animate-fade-in">
            <strong>{t("disclaimerBold")}</strong> {t("disclaimerBody")}
          </div>
          <PrescriptionExplainer locale={locale} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
