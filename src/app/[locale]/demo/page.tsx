import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAppConfig } from "@/lib/env";
import DemoPageClient from "./page.client";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "demo" });
  const { appName } = getAppConfig();
  return { title: `${t("title")} — ${appName}`, description: t("lead") };
}

export default function DemoPage() {
  return <DemoPageClient />;
}
