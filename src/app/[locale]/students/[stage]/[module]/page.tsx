import type { Metadata } from "next";
import { Link } from "@/navigation";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Flag,
  Lightbulb,
  MessageSquare,
  ShieldCheck,
  Target,
} from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { StudentAcademyLessonFooter } from "@/components/StudentAcademyLessonFooter";
import { StudentAcademyIllustration } from "@/components/StudentAcademyIllustration";
import { StudentFieldLab } from "@/components/StudentFieldLab";
import {
  getNextModuleInStage,
  getModuleIndexInStage,
  getStudentModule,
  getModulesByStage,
  STUDENT_HUB_THEME,
  STUDENT_MODULES,
  STAGE_ORDER,
  studentHealthMessageKey,
  type StageId,
} from "@/data/student-health";

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
  return { title: t(titleKey) };
}

export function generateStaticParams() {
  return STUDENT_MODULES.map((m) => ({ stage: m.stageId, module: m.id }));
}

const STI_MODULES = new Set(["stiBasics", "stiTesting", "stiMyths"]);
const SEXUAL_HEALTH_MODULES = new Set(["stiBasics", "stiTesting", "stiMyths", "consentBasics"]);

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
  const nextHref = nextMod
    ? `/students/${stage}/${nextMod.id}`
    : `/students/quiz/${stage}`;
  const showStiNote = STI_MODULES.has(moduleId);
  const showSexualHealthSupport = SEXUAL_HEALTH_MODULES.has(moduleId);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F7]">
      <Header />
      <main id="main-content" className="flex-1 pb-2">
        <div className="px-5 py-6">
          <Link
            href="/students"
            className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("quiz.back")}
          </Link>

          <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between text-xs font-bold text-gray-500">
              <span>{t("lesson.stepLabel", { current: moduleIndex + 1, total: stageModules.length })}</span>
              <span>{t(`stages.${stage}`)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-indigo-500"
                style={{ width: `${((moduleIndex + 1) / stageModules.length) * 100}%` }}
              />
            </div>
          </div>

          {showStiNote && (
            <div className="mb-4 rounded-xl border border-indigo-100 bg-indigo-50/80 p-3 text-sm text-indigo-900">
              {t("hub.disclaimer")}
            </div>
          )}

          {showSexualHealthSupport && (
            <div className="mb-4 rounded-xl border border-rose-100 bg-white p-4 shadow-sm">
              <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-rose-800">
                <ShieldCheck className="h-4 w-4" />
                {t("sexualHealthSupport.title")}
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">
                {t("sexualHealthSupport.body")}
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <Link
                  href="/navigate"
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700"
                >
                  {t("sexualHealthSupport.findCare")}
                </Link>
                <Link
                  href="/rights"
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-indigo-50 px-3 py-2 text-sm font-bold text-indigo-700"
                >
                  {t("sexualHealthSupport.rights")}
                </Link>
              </div>
            </div>
          )}

          <div className="mb-6 overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-gray-100">
            <StudentAcademyIllustration
              visual={mod.visual}
              title={tk(mod.titleKey)}
              variant="lesson"
            />
            <div
              className="p-6"
              style={{
                backgroundColor: STUDENT_HUB_THEME.bg,
                borderColor: STUDENT_HUB_THEME.borderColor,
                borderTopWidth: 1,
              }}
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="text-3xl">{mod.emoji}</span>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{tk(mod.titleKey)}</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {mod.durationMin} {tCommon("minutes")}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-gray-700">{tk(mod.descriptionKey)}</p>
            </div>
          </div>

          <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-gray-900">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-sm"
              style={{ backgroundColor: STUDENT_HUB_THEME.bg }}
            >
              💡
            </span>
            {tCommon("keyTips")}
          </h2>
          <div className="mb-6 flex flex-col gap-2">
            {mod.tips.map((tip, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <span className="mt-0.5 text-xl">{tip.icon}</span>
                <p className="flex-1 text-sm leading-relaxed text-gray-700">{tk(tip.textKey)}</p>
              </div>
            ))}
          </div>

          <div className="mb-6 rounded-xl border-l-4 bg-amber-50 p-4" style={{ borderColor: "#EAB308" }}>
            <h3 className="mb-1 flex items-center gap-2 text-sm font-bold text-amber-800">
              <Lightbulb className="h-4 w-4" />
              {tCommon("didYouKnow")}
            </h3>
            <p className="text-sm leading-relaxed text-amber-900">{tk(mod.factKey)}</p>
          </div>

          <div className="mb-4 rounded-xl border border-indigo-100 bg-white p-4 shadow-sm">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-indigo-800">
              <MessageSquare className="h-4 w-4" />
              {t("lesson.scenarioTitle")}
            </h3>
            <p className="text-sm leading-relaxed text-gray-700">{tk(mod.scenarioKey)}</p>
          </div>

          <div
            className="mb-4 rounded-xl bg-white p-4 shadow-sm border-2"
            style={{ borderColor: STUDENT_HUB_THEME.color }}
          >
            <h3
              className="mb-1 flex items-center gap-2 text-sm font-bold"
              style={{ color: STUDENT_HUB_THEME.color }}
            >
              <CheckCircle2 className="h-4 w-4" />
              {tCommon("actionStep")}
            </h3>
            <p className="text-sm leading-relaxed text-gray-700">{tk(mod.actionKey)}</p>
          </div>

          <div className="mb-8 rounded-xl border border-green-100 bg-green-50 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-green-800">
              <Target className="h-4 w-4" />
              {t("lesson.challengeTitle")}
            </h3>
            <p className="text-sm leading-relaxed text-green-900">{tk(mod.challengeKey)}</p>
          </div>

          <StudentFieldLab
            moduleId={moduleId}
            subtitle={t("fieldLab.subtitle")}
            observeLabel={t("fieldLab.observeLabel")}
            decideLabel={t("fieldLab.decideLabel")}
            actLabel={t("fieldLab.actLabel")}
            reflectionLabel={t("fieldLab.title")}
            reflectionPlaceholder={t("fieldLab.placeholder")}
            savedLabel={t("fieldLab.savedLabel")}
          />

          <StudentAcademyLessonFooter
            pillarId="student_health"
            moduleId={moduleId}
            stage={stage}
            completeLabel={tCommon("markComplete")}
            completedLabel={tCommon("completed")}
            pillarColor={STUDENT_HUB_THEME.color}
            nextLessonLabel={t("workflow.startMission")}
            quizLabel={t("workflow.startQuiz")}
            backToAcademyLabel={t("quiz.continueHub")}
            completedTitle={tCommon("completed")}
            completedBody={t("lesson.completedNote")}
          />

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {previousMod && (
              <Link
                href={`/students/${stage}/${previousMod.id}`}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-3 text-sm font-medium text-gray-600 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
              >
                <ChevronLeft className="h-4 w-4" />
                {tCommon("previous")}: {previousMod.emoji}
              </Link>
            )}
            <Link
              href={nextHref}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-3 text-sm font-medium text-gray-600 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
            >
              {nextMod ? (
                <>
                  {tCommon("next")}: {nextMod.emoji} {tk(nextMod.titleKey)}
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  <Flag className="h-4 w-4" />
                  {t("workflow.takeStageQuiz")}
                </>
              )}
            </Link>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
