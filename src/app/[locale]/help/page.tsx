import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { HelpRequestForm } from "@/components/HelpRequestForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "operations" });
  return { title: t("helpPageTitle"), description: t("helpPageSubtitle") };
}

export default async function HelpPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "operations" });

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <main id="main-content" className="flex-1 pb-8">
        <div className="px-5 py-6">
          <h1 className="mb-1 text-2xl font-bold text-[var(--color-text-primary)]">
            {t("helpPageTitle")}
          </h1>
          <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
            {t("helpPageSubtitle")}
          </p>
          <HelpRequestForm />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
