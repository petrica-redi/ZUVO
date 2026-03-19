import type { Metadata } from "next";
import { Link } from "@/navigation";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ChevronLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

const PILLARS = [
  "prevention", "nutrition", "maternal", "children", "chronic", "mental",
] as const;

type Props = {
  params: Promise<{ locale: string; pillar: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, pillar } = await params;
  if (!PILLARS.includes(pillar as (typeof PILLARS)[number])) return {};
  const t = await getTranslations({ locale, namespace: "pillars" });
  return { title: t(pillar as (typeof PILLARS)[number]) };
}

export async function generateStaticParams() {
  return PILLARS.map((pillar) => ({ pillar }));
}

export default async function PillarPage({ params }: Props) {
  const { locale, pillar } = await params;
  if (!PILLARS.includes(pillar as (typeof PILLARS)[number])) notFound();

  const t = await getTranslations({ locale, namespace: "pillars" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7]">
      <Header />
      <main className="flex-1 pb-28 pt-14">
        <div className="mx-auto max-w-lg px-5 py-6">
          <Link
            href="/learn"
            className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("title")}
          </Link>
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            {t(pillar as (typeof PILLARS)[number])}
          </h1>
          <p className="text-gray-600">{tCommon("comingSoon")}</p>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
