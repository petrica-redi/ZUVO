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
import { StudentAcademyRouteGate } from "@/components/StudentAcademyRouteGate";
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
    title: `${t(titleKey)} · ${t("metaSuffix")}`,
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
  const { locale, stage, module: moduleId } = await params;
  if (!isStage(stage)) notFound();
  const mod = getStudentModule(stage, moduleId);
  if (!mod) notFound();

  const t = await getTranslations({ locale, namespace: "studentHealth" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

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
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      {/* Sticky stepper rail */}
      <div className="glass-bar sticky top-14 z-30">
        <div className="mx-auto max-w-3xl px-4 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/students"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              <ChevronLeft className="lucide h-3.5 w-3.5" strokeWidth={1.75} />
              {t("quiz.back")}
            </Link>
            <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
              <span>{t(`stages.${stage}`)}</span>
              <span aria-hidden>·</span>
              <span>
                {t("lesson.stepLabel", { current: lessonNumber, total: lessonsTotal })}
              </span>
            </div>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[var(--color-surface-subtle)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--color-brand-500)] to-[var(--color-brand-700)] transition-all duration-700"
              style={{
                width: `${lessonProgressPct}%`,
                transitionTimingFunction: "var(--ease-emphasized)",
              }}
            />
          </div>
        </div>
      </div>

      <main id="main-content" className="flex-1 pb-8">
        <StudentAcademyRouteGate stage={stage}>
        <ErrorBoundary>
          <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8">
            {showStiNote && (
              <div className="mb-4 flex items-start gap-3 rounded-2xl border border-[var(--color-brand-200)] bg-[var(--color-accent-soft)] p-4 text-sm leading-relaxed text-[var(--color-accent-text)]">
                <ShieldCheck className="lucide mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-accent)]" strokeWidth={1.75} />
                <span>{t("hub.disclaimer")}</span>
              </div>
            )}

            {showSexualHealthSupport && (
              <Card variant="elevated" className="mb-5 overflow-hidden border-0 bg-gradient-to-br from-rose-50 to-pink-50 ring-1 ring-rose-100">
                <div className="p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-2">
                      <ShieldCheck className="lucide h-4 w-4 text-white" strokeWidth={1.85} />
                    </div>
                    <h2 className="text-sm font-extrabold uppercase tracking-wider text-rose-800">
                      {t("sexualHealthSupport.title")}
                    </h2>
                  </div>
                  <p className="text-sm leading-relaxed text-rose-900">
                    {t("sexualHealthSupport.body")}
                  </p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <Link
                      href="/navigate"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-1 transition-all hover:bg-rose-700 active:scale-[0.97]"
                    >
                      {t("sexualHealthSupport.findCare")}
                    </Link>
                    <Link
                      href="/rights"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-rose-700 ring-1 ring-rose-200 transition-all hover:bg-rose-50 active:scale-[0.97]"
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
                  <Badge variant="brand">{t(`stages.${stage}`)}</Badge>
                  <Badge variant="muted">
                    <Clock className="lucide h-3 w-3" strokeWidth={1.85} />
                    {mod.durationMin} {tCommon("minutes")}
                  </Badge>
                  <Badge
                    variant="muted"
                    title={t("lesson.stepLabel", {
                      current: lessonNumber,
                      total: lessonsTotal,
                    })}
                  >
                    <BookOpen className="lucide h-3 w-3" strokeWidth={1.85} />
                    L{lessonNumber}/{lessonsTotal}
                  </Badge>
                </div>
                <h1
                  className="flex items-start gap-3 font-display text-2xl font-extrabold leading-tight tracking-tight text-[var(--color-text-primary)] md:text-3xl"
                  style={{ letterSpacing: "-0.025em" }}
                >
                  <span aria-hidden className="text-3xl leading-none">{mod.emoji}</span>
                  <span>{tk(mod.titleKey)}</span>
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base">
                  {tk(mod.descriptionKey)}
                </p>
              </div>
            </Card>

            {/* Key takeaways */}
            <section className="mb-6">
              <SectionTitle icon={<Lightbulb className="lucide h-4 w-4 text-[var(--color-ember-500)]" strokeWidth={1.75} />}>
                {tCommon("keyTips")}
              </SectionTitle>
              <div className="grid gap-2 sm:grid-cols-2">
                {mod.tips.map((tip, i) => (
                  <Card key={i} variant="interactive">
                    <div className="flex items-start gap-3 p-4">
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-ember-50)] to-[var(--color-ember-100)] text-lg ring-1 ring-[var(--color-ember-200)]">
                        {tip.icon}
                      </span>
                      <p className="flex-1 text-sm leading-relaxed text-[var(--color-text-primary)]">
                        {tk(tip.textKey)}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Did you know */}
            <Card variant="elevated" className="mb-6 overflow-hidden border-0 bg-gradient-to-br from-[var(--color-ember-50)] to-[var(--color-ember-100)] ring-1 ring-[var(--color-ember-200)]">
              <div className="flex items-start gap-3 p-5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl gradient-ember grain-overlay shadow-ember">
                  <Lightbulb className="lucide h-5 w-5 text-white" strokeWidth={1.85} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-ember-700)]">
                    {tCommon("didYouKnow")}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--color-ember-900)]">
                    {tk(mod.factKey)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Field scenario */}
            <Card variant="elevated" className="mb-4 overflow-hidden">
              <div className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl gradient-brand grain-overlay shadow-brand">
                    <MessageSquare className="lucide h-4 w-4 text-white" strokeWidth={1.85} />
                  </div>
                  <span className="text-sm font-extrabold uppercase tracking-wider text-[var(--color-accent-text)]">
                    {t("lesson.scenarioTitle")}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">
                  {tk(mod.scenarioKey)}
                </p>
              </div>
            </Card>

            {/* Action step */}
            <Card variant="elevated" className="mb-4 overflow-hidden border-0 bg-gradient-to-br from-[var(--color-brand-50)] to-[var(--color-brand-100)] ring-1 ring-[var(--color-brand-200)]">
              <div className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  <CheckCircle2 className="lucide h-4 w-4 text-[var(--color-brand-700)]" strokeWidth={1.85} />
                  <span className="text-sm font-extrabold uppercase tracking-wider text-[var(--color-brand-800)]">
                    {tCommon("actionStep")}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-brand-900)]">
                  {tk(mod.actionKey)}
                </p>
              </div>
            </Card>

            {/* Student challenge */}
            <Card variant="elevated" className="mb-6 overflow-hidden border-0 bg-gradient-to-br from-emerald-50 to-green-50 ring-1 ring-emerald-100">
              <div className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-2">
                    <Target className="lucide h-4 w-4 text-white" strokeWidth={1.85} />
                  </div>
                  <span className="text-sm font-extrabold uppercase tracking-wider text-emerald-800">
                    {t("lesson.challengeTitle")}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-emerald-900">{tk(mod.challengeKey)}</p>
              </div>
            </Card>

            {/* Field Lab interaction */}
            <section className="mb-6">
              <SectionTitle icon={<Sparkles className="lucide h-4 w-4 text-[var(--color-ember-500)]" strokeWidth={1.75} />}>
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
                <SectionTitle icon={<BookOpen className="lucide h-4 w-4 text-[var(--color-text-muted)]" strokeWidth={1.75} />}>
                  {t("lesson.sourcesTitle")}
                </SectionTitle>
                <Card variant="default">
                  <div className="divide-y divide-[var(--color-border-subtle)]">
                    {mod.sources.map((src) => (
                      <a
                        key={src.url}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 p-4 transition-colors hover:bg-[var(--color-surface-hover)]"
                      >
                        <Badge variant="default" className="flex-shrink-0">
                          {src.label}
                        </Badge>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-bold text-[var(--color-text-primary)]">
                            {src.title}
                          </div>
                          <div className="truncate text-[11px] text-[var(--color-text-muted)]">
                            {src.url}
                          </div>
                        </div>
                        <ExternalLink className="lucide h-4 w-4 flex-shrink-0 text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-accent)]" strokeWidth={1.75} />
                      </a>
                    ))}
                  </div>
                </Card>
                <p className="mt-2 px-1 text-[11px] leading-relaxed text-[var(--color-text-muted)]">
                  {t("lesson.sourcesNote")}
                </p>
              </section>
            )}

            {/* Clinical review stamp */}
            <ReviewStamp module={mod} t={t} />

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
                  className="card-interactive group flex items-center gap-3 rounded-2xl bg-[var(--color-surface)] p-3.5 text-sm font-medium text-[var(--color-text-primary)]"
                >
                  <ChevronLeft className="lucide h-4 w-4 flex-shrink-0 text-[var(--color-text-muted)] transition-all group-hover:-translate-x-0.5 group-hover:text-[var(--color-accent)]" strokeWidth={1.75} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
                      {tCommon("previous")}
                    </div>
                    <div className="truncate text-sm font-bold">
                      {previousMod.emoji} {tk(previousMod.titleKey)}
                    </div>
                  </div>
                </Link>
              ) : (
                <span className="hidden sm:block" />
              )}
              <Link
                href={nextHref}
                className="card-interactive group flex items-center gap-3 rounded-2xl bg-gradient-to-br from-[var(--color-brand-50)] to-[var(--color-brand-100)] p-3.5 text-sm font-medium text-[var(--color-brand-900)] ring-1 ring-[var(--color-brand-200)]"
              >
                <div className="min-w-0 flex-1 text-right">
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-brand-700)]">
                    {nextMod ? tCommon("next") : t("workflow.takeStageQuiz")}
                  </div>
                  <div className="truncate text-sm font-bold">
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
                  <ArrowRight className="lucide h-4 w-4 flex-shrink-0 text-[var(--color-brand-700)] transition-all group-hover:translate-x-0.5" strokeWidth={1.85} />
                ) : (
                  <Flag className="lucide h-4 w-4 flex-shrink-0 text-[var(--color-brand-700)]" strokeWidth={1.85} />
                )}
              </Link>
            </div>
          </div>
        </ErrorBoundary>
        </StudentAcademyRouteGate>
      </main>
      <BottomNav />
    </div>
  );
}

function ReviewStamp({
  module: mod,
  t,
}: {
  module: { review: { reviewedAt: string; reviewerRole: string; nextReviewDue: string } };
  t: (key: string, values?: Record<string, string | number | Date>) => string;
}) {
  const due = new Date(mod.review.nextReviewDue);
  const now = new Date();
  const overdue = due.getTime() < now.getTime();
  const reviewed = new Date(mod.review.reviewedAt).toISOString().slice(0, 10);

  return (
    <div
      className={`mb-5 flex items-start gap-3 rounded-2xl border p-3 text-xs leading-relaxed ${
        overdue
          ? "border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]"
          : "border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)]"
      }`}
    >
      <span aria-hidden className="mt-0.5">
        {overdue ? "⚠️" : "✅"}
      </span>
      <div className="flex-1">
        <div className="font-extrabold uppercase tracking-widest">
          {t(overdue ? "lesson.reviewOverdue" : "lesson.reviewUpToDate")}
        </div>
        <div className="mt-0.5">
          {t("lesson.reviewMeta", { reviewer: mod.review.reviewerRole, date: reviewed })}
        </div>
      </div>
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
      <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
        {children}
      </h2>
    </div>
  );
}
