import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getAppConfig } from "@/lib/env";
import DemoPageClient from "./page.client";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "demo" });
  const { appName } = getAppConfig();
  return { title: `${t("tourIntroTitle")} — ${appName}`, description: t("tourIntroLead") };
}

export default function DemoPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-[#0A1628]" aria-busy="true" />}>
      <DemoPageClient />
    </Suspense>
  );
}
