import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { MediatorDashboard } from "@/components/MediatorDashboard";
import {
  MEDIATOR_LABEL_KEYS,
  type MediatorLabels,
} from "@/components/mediator/labels";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mediator" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function MediatorPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mediator" });

  const labels = Object.fromEntries(
    MEDIATOR_LABEL_KEYS.map((key) => [key, t(key)]),
  ) as MediatorLabels;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <main id="main-content" className="flex-1 pb-2">
        <div className="px-5 py-6">
          <MediatorDashboard labels={labels} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
