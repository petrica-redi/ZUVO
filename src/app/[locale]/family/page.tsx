import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { FamilyHub } from "@/components/FamilyHub";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Family Health — Redi Health",
    description: "Track health for your whole family. No account needed.",
  };
}

export default function FamilyPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <SosButton />
      <main id="main-content" className="flex-1 pb-2">
        <div className="px-4 py-4 sm:px-5 sm:py-5">
          <div className="platform-shell">
            <FamilyHub />
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
