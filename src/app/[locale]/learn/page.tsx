import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { AppShell, ScreenMain } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { LearnPillarList } from "@/components/learn/LearnPillarList";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pillars" });
  return { title: t("title"), description: t("title") };
}

export default async function LearnPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pillars" });
  const tLearn = await getTranslations({ locale, namespace: "learn" });

  const labels = {
    prevention: t("prevention"),
    nutrition: t("nutrition"),
    maternal: t("maternal"),
    children: t("children"),
    chronic: t("chronic"),
    mental: t("mental"),
  };

  return (
    <AppShell>
      <Header />
      <ScreenMain>
        <div className="px-5 py-6">
          <PageHeader
            eyebrow={tLearn("pageEyebrow")}
            title={t("title")}
            subtitle={tLearn("pageIntro")}
          />
          <LearnPillarList labels={labels} />
        </div>
      </ScreenMain>
      <BottomNav />
    </AppShell>
  );
}
