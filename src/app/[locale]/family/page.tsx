import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { FamilyHub } from "@/components/FamilyHub";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Family Health — Zuvo",
    description: "Track health for your whole family. No account needed.",
  };
}

export default function FamilyPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F7]">
      <Header />
      <SosButton />
      <main id="main-content" className="flex-1 pb-2">
        <div className="px-5 py-6">
          <FamilyHub />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
