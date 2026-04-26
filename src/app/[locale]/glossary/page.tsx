import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { HealthGlossary } from "@/components/HealthGlossary";

export const metadata: Metadata = {
  title: "Health Glossary — Sastipe",
  description: "Medical terms explained in simple words",
};

export default function GlossaryPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F7]">
      <Header />
      <SosButton />
      <main id="main-content" className="flex-1 pb-2">
        <div className="px-4 py-4">
          <HealthGlossary />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
