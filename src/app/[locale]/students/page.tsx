import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { StudentAcademyHub } from "@/components/StudentAcademyHub";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <SosButton />
      <main id="main-content" className="flex-1 pb-12">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">
          <ErrorBoundary>
            <StudentAcademyHub />
          </ErrorBoundary>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
