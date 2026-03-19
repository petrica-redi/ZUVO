import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  return { title: t("learnMore"), description: t("subtitle") };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7]">
      <Header />
      <main className="flex-1 pb-28 pt-14">
        <div className="mx-auto max-w-lg px-5 py-8">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">{t("learnMore")}</h1>
          <p className="leading-relaxed text-gray-600">{t("subtitle")}</p>
          <p className="mt-4 leading-relaxed text-gray-600">
            Sastipe is a health literacy platform built for Roma communities across Europe.
            We provide free health education in 15 languages, tailored to local needs.
          </p>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
