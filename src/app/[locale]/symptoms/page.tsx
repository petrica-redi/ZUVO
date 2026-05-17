import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { BodyMap } from "@/components/BodyMap";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "symptoms.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function SymptomsPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <SosButton />
      <main id="main-content" className="flex-1 pb-2">
        <div className="px-5 py-6">
          <BodyMap locale={locale} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
