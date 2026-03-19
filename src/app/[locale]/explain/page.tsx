import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { PrescriptionExplainer } from "@/components/PrescriptionExplainer";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Understand Your Prescription — Zuvo",
    description: "Get your diagnosis and medications explained in simple words",
  };
}

export default async function ExplainPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7]">
      <Header />
      <SosButton />
      <main className="flex-1 pb-28 pt-14">
        <div className="mx-auto max-w-lg px-5 py-6">
          {/* Disclaimer */}
          <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700 animate-fade-in">
            <strong>Not medical advice.</strong> This tool explains medical terms in simple language. Always follow your doctor&apos;s instructions.
          </div>
          <PrescriptionExplainer locale={locale} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
