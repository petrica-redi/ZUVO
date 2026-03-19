import type { Metadata } from "next";
import { Link } from "@/navigation";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ChevronLeft, MapPin } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

const REGIONS = [
  "romania", "bulgaria", "hungary", "northMacedonia", "slovakia", "serbia",
  "turkey", "greece", "albania", "czech", "croatia", "bosnia", "slovenia", "kosovo",
] as const;

type Props = {
  params: Promise<{ locale: string; region: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, region } = await params;
  if (!REGIONS.includes(region as (typeof REGIONS)[number])) return {};
  const t = await getTranslations({ locale, namespace: "regions" });
  return { title: t(region as (typeof REGIONS)[number]) };
}

export async function generateStaticParams() {
  return REGIONS.map((region) => ({ region }));
}

export default async function RegionPage({ params }: Props) {
  const { locale, region } = await params;
  if (!REGIONS.includes(region as (typeof REGIONS)[number])) notFound();

  const t = await getTranslations({ locale, namespace: "regions" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F7]">
      <Header />
      <main className="flex-1 pb-2">
        <div className="px-5 py-6">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("title")}
          </Link>
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[#C0392B]" />
            <h1 className="text-2xl font-bold text-gray-900">
              {t(region as (typeof REGIONS)[number])}
            </h1>
          </div>
          <p className="text-gray-600">{t("subtitle")}</p>
          <p className="mt-4 text-gray-500">{tCommon("comingSoon")}</p>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
