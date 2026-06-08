import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Target, Trophy, Zap, Users } from "lucide-react";
import { Card, Badge, Progress } from "@/components/ui";

type Props = { params: Promise<{ locale: string }> };

const CHALLENGES = [
  { id: "c1", current: 34, target: 50, daysLeft: 3, reward: 500, type: "community" as const },
  { id: "c2", current: 4, target: 7, daysLeft: 3, reward: 150, type: "personal" as const },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "challenges" });
  return { title: t("meta.title"), description: t("meta.description") };
}

export default async function ChallengesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "challenges" });

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <main id="main-content" className="flex-1 pb-8">
        <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">

          <div className="mb-8 text-center animate-fade-in-up">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--color-surface)] shadow-1">
              <Trophy className="lucide h-8 w-8 text-[var(--color-ember-500)]" strokeWidth={1.85} />
            </div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)] md:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base max-w-md mx-auto">
              {t("subtitle")}
            </p>
          </div>

          <div className="space-y-4 animate-fade-in-up delay-100">
            {CHALLENGES.map((challenge) => (
              <Card key={challenge.id} variant="elevated" className="overflow-hidden">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant={challenge.type === "community" ? "info" : "brand"}>
                      {challenge.type === "community" ? <Users className="h-3 w-3 mr-1 inline" /> : <Target className="h-3 w-3 mr-1 inline" />}
                      {t(`types.${challenge.type}`)}
                    </Badge>
                    <div className="flex items-center text-[var(--color-ember-600)] font-bold text-sm">
                      <Zap className="h-4 w-4 mr-1" />
                      +{challenge.reward} XP
                    </div>
                  </div>

                  <h3 className="font-display text-lg font-extrabold text-[var(--color-text-primary)] mb-1">
                    {t(`items.${challenge.id}.title`)}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                    {t(`items.${challenge.id}.description`)}
                  </p>

                  <div className="mb-2 flex items-center justify-between text-xs font-bold text-[var(--color-text-secondary)]">
                    <span>
                      {challenge.current} / {challenge.target}
                    </span>
                    <span className="flex items-center text-rose-500">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      {t("daysLeft", { count: challenge.daysLeft })}
                    </span>
                  </div>
                  <Progress value={(challenge.current / challenge.target) * 100} variant="amber" />

                  <button className="mt-5 w-full py-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] text-sm font-extrabold text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors">
                    {t("viewLeaderboard")}
                  </button>
                </div>
              </Card>
            ))}
          </div>

        </div>
      </main>
      <BottomNav />
    </div>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
