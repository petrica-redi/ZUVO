import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Award, Download, Share2, Sparkles, GraduationCap } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(): Promise<Metadata> {
  return { title: `Certificate — Sastipe`, description: "National Health Literacy Certificate" };
}

export default async function CertificatePage({ params }: Props) {
  await params;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <main id="main-content" className="flex-1 pb-8">
        <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
          
          <div className="mb-8 text-center animate-fade-in-up">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl gradient-ember grain-overlay shadow-ember">
              <Award className="lucide h-8 w-8 text-white" strokeWidth={1.85} />
            </div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)] md:text-4xl">
              Your Certificate
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base max-w-md mx-auto">
              You have completed the National Stage of the Student Health Academy.
            </p>
          </div>

          <div className="relative mx-auto max-w-lg mb-8 animate-fade-in-up delay-100">
            {/* The Certificate UI */}
            <div className="aspect-[1.414] w-full rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-black/5 relative overflow-hidden flex flex-col items-center justify-center text-center">
              <div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle, #FBBF24 0%, transparent 70%)" }} />
              <div aria-hidden className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle, #4F46E5 0%, transparent 70%)" }} />
              
              <GraduationCap className="lucide h-12 w-12 text-[var(--color-brand-600)] mb-4" strokeWidth={1.5} />
              
              <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-2">
                Certificate of Completion
              </div>
              
              <div className="font-display text-2xl font-black text-gray-900 mb-6" style={{ fontFamily: "serif" }}>
                National Health Literacy
              </div>

              <div className="text-sm text-gray-600 max-w-[250px] mb-8">
                Awarded for completing the Sastipe Student Health Academy curriculum.
              </div>

              <div className="w-full flex justify-between items-end border-t border-gray-100 pt-4 px-4">
                <div className="text-left">
                  <div className="text-[9px] font-bold uppercase text-gray-400">Date</div>
                  <div className="text-xs font-semibold text-gray-800">{new Date().toLocaleDateString()}</div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <Sparkles className="lucide h-6 w-6 text-amber-400 mb-1" strokeWidth={1.5} />
                  <div className="text-[9px] font-bold uppercase text-gray-400">Sastipe Org</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto animate-fade-in-up delay-200">
            <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl gradient-brand grain-overlay px-6 py-4 text-sm font-extrabold text-white shadow-brand transition-all hover:shadow-4 active:scale-[0.97]">
              <Download className="lucide h-5 w-5" strokeWidth={2} />
              Download PDF
            </button>
            <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[var(--color-border-default)] bg-[var(--color-surface)] px-6 py-4 text-sm font-extrabold text-[var(--color-text-primary)] transition-all hover:border-[var(--color-border-strong)] active:scale-[0.97]">
              <Share2 className="lucide h-5 w-5 text-[var(--color-text-secondary)]" strokeWidth={2} />
              Share
            </button>
          </div>

        </div>
      </main>
      <BottomNav />
    </div>
  );
}
