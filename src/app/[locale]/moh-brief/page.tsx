import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { Link } from "@/navigation";
import { ChevronLeft } from "lucide-react";
import { AppShell, ScreenMain } from "@/components/layout/AppShell";
import { BriefingSections } from "@/components/briefing/BriefingSections";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mohbrief" });
  return { title: t("pageTitle"), description: t("kicker") };
}

export default async function MohBriefPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mohbrief" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const year = new Date().getFullYear();
  const sections = [
    { title: t("section1Title"), body: t("section1Body") },
    { title: t("section2Title"), body: t("section2Body") },
    { title: t("section3Title"), body: t("section3Body") },
    { title: t("section4Title"), body: t("section4Body") },
    { title: t("section5Title"), body: t("section5Body") },
  ];
  return (
    <AppShell>
      <Header />
      <SosButton />
      <ScreenMain>
        <div className="px-5 py-6 pb-24">
          <Link
            href="/more"
            className="mb-5 inline-flex items-center gap-1.5 rounded-2xl border border-white/60 bg-white/70 px-3 py-2 text-sm font-semibold text-[#C0392B] shadow-sm backdrop-blur-sm transition active:scale-[0.99]"
          >
            <ChevronLeft className="h-4 w-4" />
            {tCommon("back")}
          </Link>
          <BriefingSections
            kicker={t("kicker")}
            kickerClassName="text-amber-800/95"
            pageTitle={t("pageTitle")}
            sections={sections}
            footer={`${year} · Sastipe`}
          />
        </div>
      </ScreenMain>
      <BottomNav />
    </AppShell>
  );
}
