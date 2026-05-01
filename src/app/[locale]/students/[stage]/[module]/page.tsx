import type { Metadata } from "next";
import { Link } from "@/navigation";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Clock,
  ExternalLink,
  Flag,
  Lightbulb,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { StudentAcademyLessonFooter } from "@/components/StudentAcademyLessonFooter";
import { StudentAcademyIllustration } from "@/components/StudentAcademyIllustration";
import { StudentFieldLab } from "@/components/StudentFieldLab";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import {
  getNextModuleInStage,
  getModuleIndexInStage,
  getStudentModule,
  getModulesByStage,
  STUDENT_MODULES,
  STAGE_ORDER,
  studentHealthMessageKey,
  type StageId,
} from "@/data/student-health";
import { Badge, Card } from "@/components/ui";

type Props = { params: Promise<{ locale: string; stage: string; module: string }> };

function isStage(s: string): s is StageId {
  return STAGE_ORDER.includes(s as StageId);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, stage, module: moduleId } = await params;
  if (!isStage(stage)) return {};
  const mod = getStudentModule(stage, moduleId);
  if (!mod) return {};
  const t = await getTranslations({ locale, namespace: "studentHealth" });
  const titleKey = studentHealthMessageKey(mod.titleKey);
  const descKey = studentHealthMessageKey(mod.descriptionKey);
  return {
    title: `${t(titleKey)} · Student Health Academy`,
    description: t(descKey),
  };
}

export function generateStaticParams() {
  return STUDENT_MODULES.map((m) => ({ stage: m.stageId, module: m.id }));
}

const STI_MODULES = new Set(["stiBasics", "stiTesting", "stiMyths"]);
const SEXUAL_HEALTH_MODULES = new Set([
  "stiBasics",
  "stiTesting",
  "stiMyths",
  "consentBasics",
]);

export default async function StudentModulePage({ params }: Props) {
  const { stage, module: moduleId } = await params;
  if (!isStage(stage)) notFound();
  const mod = getStudentModule(stage, moduleId);
  if (!mod) notFound();

  const t = await getTranslations("studentHealth");
  const tCommon = await getTranslations("common");

  const tk = (fullKey: string) => t(studentHealthMessageKey(fullKey));
  const nextMod = getNextModuleInStage(stage, moduleId);
  const stageModules = getModulesByStage(stage);
  const moduleIndex = getModuleIndexInStage(stage, moduleId);
  const previousMod = moduleIndex > 0 ? stageModules[moduleIndex - 1] : undefined;
  const lessonsTotal = stageModules.length;
  const lessonNumber = moduleIndex + 1;
  const lessonProgressPct = Math.round((lessonNumber / lessonsTotal) * 100);
  const nextHref = nextMod
    ? `/students/${stage}/${nextMod.id}`
    : `/students/quiz/${stage}`;
  const showStiNote = STI_MODULES.has(moduleId);
  const showSexualHealthSupport = SEXUAL_HEALTH_MODULES.has(moduleId);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-gradient-to-b from-[#F5F5F7] via-white to-[#F5F5F7]">
      <Header />
      {/* Sticky stepper rail */}
      <div className="sticky top-0 z-30 border-b border-gray-100 bg-white/85 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/students"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 transition hover:text-gray-900"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              {t("quiz.back")}
            </Link>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <span>{t(`stages.${stage}`)}</span>
              <span aria-hidden>·</span>
              <span>
                {t("lesson.stepLabel", { current: lessonNumber, total: lessonsTotal })}
              </span>
            </div>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
              style={{ width: `${lessonProgressPct}%` }}
            />
          </div>
        </div>
      </div>

      <main id="main-content" className="flex-1 pb-8">
        <ErrorBoundary>
          <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8">
            {showStiNote && (
              <div className="mb-4 flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 text-sm leading-relaxed text-indigo-900">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-500" />
                <span>{t("hub.disclaimer")}</span>
              </div>
            )}

            {showSexualHealthSupport && (
              <Card variant="elevated" className="mb-5 overflow-hidden border-0 bg-gradient-to-br from-rose-50 to-pink-50 ring-1 ring-rose-100">
                <div className="p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-md shadow-rose-500/30">
                      <ShieldCheck className="h-4 w-4 text-white" />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-wider text-rose-800">
                      {t("sexualHealthSupport.title")}
                    </h2>
                  </div>
                  <p className="text-sm leading-relaxed text-rose-900">
                    {t("sexualHealthSupport.body")}
                  </p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <Link
                      href="/navigate"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition active:scale-[0.97]"
                    >
                      {t("sexualHealthSupport.findCare")}
                    </Link>
                    <Link
                      href="/rights"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-rose-700 ring-1 ring-rose-200 transition hover:bg-rose-50 active:scale-[0.97]"
                    >
                      {t("sexualHealthSupport.rights")}
                    </Link>
                  </div>
                </div>
              </Card>
            )}

            {/* Hero */}
            <Card variant="elevated" className="mb-6 overflow-hidden">
              <StudentAcademyIllustration
                visual={mod.visual}
                title={tk(mod.titleKey)}
                variant="lesson"
                showLabel
                className="rounded-b-none border-b-0"
              />
              <div className="p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge variant="info">{t(`stages.${stage}`)}</Badge>
                  <Badge variant="muted">
                    <Clock className="h-3 w-3" />
                    {mod.durationMin} {tCommon("minutes")}
                  </Badge>
                  <Badge variant="muted">
                    <BookOpen className="h-3 w-3" />
                    {t("lesson.stepLabel", {
                      current: lessonNumber,
                      total: lessonsTotal,
                    })}
                  </Badge>
                </div>
                <h1 className="flex items-start gap-3 text-2xl font-black leading-tight tracking-tight text-gray-900 md:text-3xl">
                  <span aria-hidden className="text-3xl leading-none">{mod.emoji}</span>
                  <span>{tk(mod.titleKey)}</span>
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">
                  {tk(mod.descriptionKey)}
                </p>
              </div>
            </Card>

            {/* Key takeaways */}
            <section className="mb-6">
              <SectionTitle icon={<Lightbulb className="h-4 w-4 text-amber-500" />}>
                {tCommon("keyTips")}
              </SectionTitle>
              <div className="grid gap-2 sm:grid-cols-2">
                {mod.tips.map((tip, i) => (
                  <Card key={i} variant="default" className="transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-start gap-3 p-4">
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 text-lg ring-1 ring-amber-100">
                        {tip.icon}
                      </span>
                      <p className="flex-1 text-sm leading-relaxed text-gray-700">{tk(tip.textKey)}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Did you know */}
            <Card variant="elevated" className="mb-6 overflow-hidden border-0 bg-gradient-to-br from-amber-50 to-orange-50 ring-1 ring-amber-100">
              <div className="flex items-start gap-3 p-5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-md shadow-amber-500/30">
                  <Lightbulb className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-black uppercase tracking-widest text-amber-700">
                    {tCommon("didYouKnow")}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-amber-900">{tk(mod.factKey)}</p>
                </div>
              </div>
            </Card>

            {/* Field scenario */}
            <Card variant="elevated" className="mb-4 overflow-hidden">
              <div className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-md shadow-indigo-500/20">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-wider text-indigo-800">
                    {t("lesson.scenarioTitle")}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-gray-700">{tk(mod.scenarioKey)}</p>
              </div>
            </Card>

            {/* Action step */}
            <Card variant="elevated" className="mb-4 overflow-hidden border-0 bg-gradient-to-br from-indigo-50 to-violet-50 ring-1 ring-indigo-100">
              <div className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-black uppercase tracking-wider text-indigo-800">
                    {tCommon("actionStep")}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-gray-800">{tk(mod.actionKey)}</p>
              </div>
            </Card>

            {/* Student challenge */}
            <Card variant="elevated" className="mb-6 overflow-hidden border-0 bg-gradient-to-br from-emerald-50 to-green-50 ring-1 ring-emerald-100">
              <div className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-md shadow-emerald-500/30">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-wider text-emerald-800">
                    {t("lesson.challengeTitle")}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-emerald-900">{tk(mod.challengeKey)}</p>
              </div>
            </Card>

            {/* Field Lab interaction */}
            <section className="mb-6">
              <SectionTitle icon={<Sparkles className="h-4 w-4 text-amber-500" />}>
                {t("fieldLab.title")}
              </SectionTitle>
              <StudentFieldLab
                moduleId={moduleId}
                subtitle={t("fieldLab.subtitle")}
                observeLabel={t("fieldLab.observeLabel")}
                decideLabel={t("fieldLab.decideLabel")}
                actLabel={t("fieldLab.actLabel")}
                observeHint={t("fieldLab.observeHint")}
                decideHint={t("fieldLab.decideHint")}
                actHint={t("fieldLab.actHint")}
                reflectionLabel={t("fieldLab.title")}
                reflectionPlaceholder={t("fieldLab.placeholder")}
                savedLabel={t("fieldLab.savedLabel")}
                saveLabel={t("fieldLab.saveLabel")}
                draftLabel={t("fieldLab.draftLabel")}
                syncedLabel={t("fieldLab.syncedLabel")}
              />
            </section>

            {/* Sources / citations */}
            {mod.sources.length > 0 && (
              <section className="mb-6">
                <SectionTitle icon={<BookOpen className="h-4 w-4 text-gray-500" />}>
                  {t("lesson.sourcesTitle")}
                </SectionTitle>
                <Card variant="default">
                  <div className="divide-y divide-gray-100">
                    {mod.sources.map((src) => (
                      <a
                        key={src.url}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 p-4 transition hover:bg-gray-50"
                      >
                        <Badge variant="default" className="flex-shrink-0">
                          {src.label}
                        </Badge>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-bold text-gray-900">
                            {src.title}
                          </div>
                          <div className="truncate text-[11px] text-gray-400">{src.url}</div>
                        </div>
                        <ExternalLink className="h-4 w-4 flex-shrink-0 text-gray-400 transition group-hover:text-indigo-600" />
                      </a>
                    ))}
                  </div>
                </Card>
                <p className="mt-2 px-1 text-[11px] leading-relaxed text-gray-400">
                  {t("lesson.sourcesNote")}
                </p>
              </section>
            )}

            {/* Mark complete + smart next step */}
            <ErrorBoundary>
              <StudentAcademyLessonFooter
                pillarId="student_health"
                moduleId={moduleId}
                stage={stage}
                completeLabel={tCommon("markComplete")}
                completedLabel={tCommon("completed")}
                pillarColor="#4338CA"
                nextLessonLabel={t("workflow.startMission")}
                quizLabel={t("workflow.startQuiz")}
                backToAcademyLabel={t("quiz.continueHub")}
                completedTitle={tCommon("completed")}
                completedBody={t("lesson.completedNote")}
                xpToastTitle={t("toast.lessonLoggedTitle")}
                xpToastBody={t("toast.lessonLoggedBody")}
              />
            </ErrorBoundary>

            {/* Prev/next */}
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {previousMod ? (
                <Link
                  href={`/students/${stage}/${previousMod.id}`}
                  className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3.5 text-sm font-medium text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md active:scale-[0.99]"
                >
                  <ChevronLeft className="h-4 w-4 flex-shrink-0 text-gray-400 transition group-hover:-translate-x-0.5 group-hover:text-indigo-500" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {tCommon("previous")}
                    </div>
                    <div className="truncate text-sm font-bold text-gray-900">
                      {previousMod.emoji} {tk(previousMod.titleKey)}
                    </div>
                  </div>
                </Link>
              ) : (
                <span className="hidden sm:block" />
              )}
              <Link
                href={nextHref}
                className="group flex items-center gap-3 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-3.5 text-sm font-medium text-indigo-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
              >
                <div className="min-w-0 flex-1 text-right">
                  <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                    {nextMod ? tCommon("next") : t("workflow.takeStageQuiz")}
                  </div>
                  <div className="truncate text-sm font-bold text-indigo-900">
                    {nextMod ? (
                      <>
                        {nextMod.emoji} {tk(nextMod.titleKey)}
                      </>
                    ) : (
                      t("hub.takeStageQuiz")
                    )}
                  </div>
                </div>
                {nextMod ? (
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-indigo-600 transition group-hover:translate-x-0.5" />
                ) : (
                  <Flag className="h-4 w-4 flex-shrink-0 text-indigo-600" />
                )}
              </Link>
            </div>
          </div>
        </ErrorBoundary>
      </main>
      <BottomNav />
    </div>
  );
}

function SectionTitle({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      {icon}
      <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-500">{children}</h2>
    </div>
  );
}
