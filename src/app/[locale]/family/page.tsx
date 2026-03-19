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
    <div className="flex min-h-screen flex-col bg-[#F5F5F7]">
      <Header />
      <SosButton />
      <main className="flex-1 pb-28 pt-14">
        <div className="mx-auto max-w-lg px-5 py-6">
          <FamilyHub />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
