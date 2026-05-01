import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Sparkles, Stethoscope, BookOpen } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { StudentAcademyHub } from "@/components/StudentAcademyHub";
import { StudentAcademyIllustration } from "@/components/StudentAcademyIllustration";
import { ErrorBoundary } from "@/components/ErrorBoundary";
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
    <div className="flex min-h-[100dvh] flex-col bg-gradient-to-b from-[#F5F5F7] via-white to-[#F5F5F7]">
      <Header />
      <SosButton />
      <main id="main-content" className="flex-1 pb-8">
        <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-10">
          {/* Editorial hero */}
          <section className="relative mb-8 overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#312E81] text-white shadow-2xl shadow-indigo-900/30">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-50 blur-3xl"
              style={{ background: "radial-gradient(circle, #FBBF24 0%, transparent 70%)" }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
              style={{ background: "radial-gradient(circle, #A78BFA 0%, transparent 70%)" }}
            />
            <div className="relative grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
              <div className="p-7 md:p-10">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-amber-200 ring-1 ring-amber-400/30 backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t("hub.kicker")}
                </span>
                <h1 className="mt-4 text-3xl font-black leading-[1.05] tracking-tight md:text-5xl">
                  {t("hub.title")}
                </h1>
                <p className="mt-4 max-w-prose text-sm leading-7 text-slate-200 md:text-base md:leading-8">
                  {t("hub.subtitle")}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white ring-1 ring-white/15">
                    <Stethoscope className="h-3.5 w-3.5 text-emerald-300" />
                    {t("hero.chipFirstAid")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white ring-1 ring-white/15">
                    <BookOpen className="h-3.5 w-3.5 text-amber-300" />
                    {t("hero.chipLiteracy")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white ring-1 ring-white/15">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
                    {t("hero.chipMissions")}
                  </span>
                </div>
              </div>
              <div className="relative min-h-[200px] md:min-h-[280px]">
                <StudentAcademyIllustration
                  visual={ACADEMY_VISUAL}
                  title={t("visuals.academy")}
                  variant="hero"
                  className="h-full rounded-none border-0 shadow-none md:rounded-l-none"
                />
              </div>
            </div>
          </section>

          <ErrorBoundary>
            <StudentAcademyHub />
          </ErrorBoundary>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
