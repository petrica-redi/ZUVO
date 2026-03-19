import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Shield, Lock, Eye, Trash2, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — Zuvo",
  description: "How Zuvo handles your data",
};

const SECTIONS = [
  {
    icon: Lock,
    title: "What data we collect",
    content: "Zuvo collects minimal data. Chat conversations are processed in real-time and not stored on our servers. Family health data is stored locally on your device only — we never see it.",
  },
  {
    icon: Eye,
    title: "How we use your data",
    content: "We use anonymous analytics (PostHog) to understand which features are most helpful. No personal health information is tracked. AI conversations are sent to OpenAI for processing — see their privacy policy for details.",
  },
  {
    icon: Shield,
    title: "Your rights",
    content: "Under GDPR, you have the right to access, correct, and delete your data. Since we store minimal data, most information exists only on your device. You can clear all local data at any time through your browser settings.",
  },
  {
    icon: Trash2,
    title: "Data deletion",
    content: "To delete all locally stored data (family profiles, health logs), clear your browser's local storage for this site. No server-side data deletion is needed as we don't store personal data on our servers.",
  },
  {
    icon: Mail,
    title: "Contact",
    content: "For privacy questions or data requests, contact us at privacy@zuvo.health. We respond within 30 days as required by GDPR.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7]">
      <Header />
      <main className="flex-1 pb-28 pt-14">
        <div className="mx-auto max-w-lg px-5 py-6">
          <div className="mb-6 text-center animate-fade-in-up">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-gray-700 to-gray-900 shadow-xl">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">Privacy Policy</h1>
            <p className="mt-2 text-sm text-gray-500">Last updated: March 2026</p>
          </div>

          <div className="space-y-4">
            {SECTIONS.map((section, i) => (
              <div key={section.title} className={`rounded-3xl border border-gray-100 bg-white p-5 shadow-sm animate-fade-in-up delay-${(i + 1) * 100}`}>
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-100">
                    <section.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <h2 className="text-base font-black text-gray-900">{section.title}</h2>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border-2 border-amber-200 bg-amber-50 p-5 animate-fade-in-up delay-600">
            <p className="text-xs font-bold text-amber-800">
              Zuvo is not a medical device and does not provide medical advice. All AI-generated content is for educational purposes only. Always consult a qualified healthcare professional for medical decisions.
            </p>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
