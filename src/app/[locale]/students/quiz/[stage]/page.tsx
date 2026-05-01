import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { StudentHealthStageQuiz } from "@/components/StudentHealthStageQuiz";
import { STAGE_ORDER, type StageId } from "@/data/student-health";

type Props = { params: Promise<{ locale: string; stage: string }> };

function isStage(s: string): s is StageId {
  return STAGE_ORDER.includes(s as StageId);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, stage } = await params;
  if (!isStage(stage)) return {};
  const t = await getTranslations({ locale, namespace: "studentHealth" });
  return { title: `${t("quiz.title")} — ${t(`stages.${stage}`)}` };
}

export function generateStaticParams() {
  return STAGE_ORDER.map((stage) => ({ stage }));
}

export default async function StudentStageQuizPage({ params }: Props) {
  const { stage } = await params;
  if (!isStage(stage)) notFound();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F7]">
      <Header />
      <main id="main-content" className="flex-1 pb-2">
        <div className="px-5 py-6">
          <StudentHealthStageQuiz stage={stage} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
