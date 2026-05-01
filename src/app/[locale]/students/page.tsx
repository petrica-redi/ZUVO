import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { StudentAcademyHub } from "@/components/StudentAcademyHub";
import { StudentAcademyIllustration } from "@/components/StudentAcademyIllustration";
import { ACADEMY_VISUAL } from "@/data/student-health";

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
          <section className="mb-8 overflow-hidden rounded-[2rem] bg-[#101827] text-white shadow-xl shadow-slate-900/10">
            <div className="grid gap-0 md:grid-cols-[1.05fr_0.95fr]">
              <div className="p-6 md:p-8">
                <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-amber-200">
                  {t("hub.kicker")}
                </span>
                <h1 className="mt-4 text-3xl font-black leading-tight md:text-4xl">
                  {t("hub.title")}
                </h1>
                <p className="mt-4 text-sm leading-7 text-slate-200 md:text-base">
                  {t("hub.subtitle")}
                </p>
              </div>
              <StudentAcademyIllustration visual={ACADEMY_VISUAL} title={t("visuals.academy")} variant="hero" />
            </div>
          </section>
          <StudentAcademyHub />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
