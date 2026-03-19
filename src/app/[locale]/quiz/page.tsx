import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { HealthQuiz } from "@/components/HealthQuiz";

export const metadata: Metadata = {
  title: "Health Quiz — Zuvo",
  description: "Test your health knowledge with interactive quizzes",
};

export default function QuizPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F7]">
      <Header />
      <SosButton />
      <main id="main-content" className="flex-1 pb-2">
        <div className="px-4 py-4">
          <HealthQuiz />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
