import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { Link } from "@/navigation";
import { ChevronLeft } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mohbrief" });
  return { title: t("pageTitle"), description: t("kicker") };
}

export default async function MohBriefPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mohbrief" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F7]">
      <Header />
      <SosButton />
      <main className="flex-1 px-5 py-4 pb-24">
        <Link
          href="/more"
          className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-[#C0392B]"
        >
          <ChevronLeft className="h-4 w-4" />
          {tCommon("back")}
        </Link>
        <p className="text-xs font-bold uppercase tracking-widest text-amber-800">{t("kicker")}</p>
        <h1 className="mt-1 text-xl font-black leading-tight text-gray-900">{t("pageTitle")}</h1>
        {[
          { title: t("section1Title"), body: t("section1Body") },
          { title: t("section2Title"), body: t("section2Body") },
          { title: t("section3Title"), body: t("section3Body") },
          { title: t("section4Title"), body: t("section4Body") },
          { title: t("section5Title"), body: t("section5Body") },
        ].map((s) => (
          <section key={s.title} className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-black text-gray-900">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 whitespace-pre-line">{s.body}</p>
          </section>
        ))}
        <p className="mt-6 text-center text-[10px] text-gray-400">
          {new Date().getFullYear()} · Sastipe
        </p>
      </main>
      <BottomNav />
    </div>
  );
}
