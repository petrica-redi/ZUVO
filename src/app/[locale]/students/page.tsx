import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { StudentAcademyHub } from "@/components/StudentAcademyHub";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "studentHealth" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function StudentsPage({ params }: Props) {
  await params;
  const t = await getTranslations("studentHealth");

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F7]">
      <Header />
      <SosButton />
      <main id="main-content" className="flex-1 pb-2">
        <div className="px-5 py-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">{t("hub.title")}</h1>
          <p className="mb-8 text-sm leading-relaxed text-gray-600">{t("hub.subtitle")}</p>
          <StudentAcademyHub />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
