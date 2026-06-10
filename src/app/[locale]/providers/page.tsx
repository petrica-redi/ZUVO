import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAppConfig } from "@/lib/env";
import { getDb } from "@/db/client";
import { providers } from "@/db/schema";
import { ensureProviderSeed } from "@/lib/providers/seed";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ProvidersList } from "@/components/ProvidersList";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "providers" });
  const { appName } = getAppConfig();
  return { title: `${t("title")} — ${appName}`, description: t("subtitle") };
}

export default async function ProvidersPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "providers" });

  const db = getDb();
  let rows: Array<{
    id: string;
    name: string;
    type: string;
    address: string;
    phone: string | null;
    latitude: number;
    longitude: number;
    region: string | null;
    isRomaFriendly: boolean;
    isFreeClinic: boolean;
    hasInterpreter: boolean;
    website: string | null;
  }> = [];

  if (db) {
    await ensureProviderSeed(db);
    rows = await db.select().from(providers);
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <main id="main-content" className="flex-1 pb-8">
        <ProvidersList
          locale={locale}
          title={t("title")}
          subtitle={t("subtitle")}
          searchPlaceholder={t("searchPlaceholder")}
          verifiedLabel={t("verified")}
          freeClinicLabel={t("freeClinic")}
          interpreterLabel={t("interpreter")}
          directionsLabel={t("getDirections")}
          providers={rows}
        />
      </main>
      <BottomNav />
    </div>
  );
}
