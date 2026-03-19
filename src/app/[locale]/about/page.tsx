import type { Metadata } from "next";
import { Link } from "@/navigation";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Heart, Shield, Globe, Users, ChevronRight, FileText, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "About — Zuvo",
  description: "About Zuvo Health Literacy Platform",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F7]">
      <Header />
      <main id="main-content" className="flex-1 pb-2">
        <div className="px-5 py-6">
          <div className="mb-8 text-center animate-fade-in-up">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl shadow-xl"
              style={{ background: "linear-gradient(135deg, #C0392B 0%, #E74C3C 50%, #F39C12 100%)" }}
            >
              <span className="text-3xl font-black text-white">Z</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900">Zuvo</h1>
            <p className="mt-1 text-sm text-gray-500">Health literacy for Roma communities</p>
            <p className="mt-1 text-xs text-gray-400">Version 1.0.0</p>
          </div>

          <div className="mb-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm animate-fade-in-up delay-100">
            <p className="text-sm leading-relaxed text-gray-600">
              Zuvo is an AI-powered health companion designed specifically for Roma communities across Europe.
              Our mission is to bridge the health literacy gap by providing trusted, culturally sensitive
              health information in simple language.
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3">
            {[
              { icon: Heart, label: "Built with care", desc: "By health mediators", color: "from-red-500 to-rose-600" },
              { icon: Globe, label: "15 languages", desc: "Across Europe", color: "from-blue-500 to-indigo-600" },
              { icon: Shield, label: "Evidence-based", desc: "WHO guidelines", color: "from-green-500 to-emerald-600" },
              { icon: Users, label: "Community-first", desc: "No judgment", color: "from-purple-500 to-violet-600" },
            ].map((item, i) => (
              <div key={item.label} className={`flex flex-col items-center gap-2 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm animate-fade-in-up delay-${(i + 2) * 100}`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} shadow-md`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs font-black text-gray-800">{item.label}</span>
                <span className="text-[10px] text-gray-400">{item.desc}</span>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm animate-fade-in-up delay-600">
            <Link href="/privacy" className="flex items-center gap-3 px-5 py-4 transition-all active:bg-gray-50">
              <Lock className="h-5 w-5 text-gray-400" />
              <span className="flex-1 text-sm font-bold text-gray-800">Privacy Policy</span>
              <ChevronRight className="h-5 w-5 text-gray-300" />
            </Link>
            <div className="border-t border-gray-50" />
            <Link href="/privacy" className="flex items-center gap-3 px-5 py-4 transition-all active:bg-gray-50">
              <FileText className="h-5 w-5 text-gray-400" />
              <span className="flex-1 text-sm font-bold text-gray-800">Terms of Service</span>
              <ChevronRight className="h-5 w-5 text-gray-300" />
            </Link>
          </div>

          <div className="mt-6 rounded-3xl border-2 border-amber-200 bg-amber-50 p-5 animate-fade-in-up delay-700">
            <p className="text-xs font-bold text-amber-800">
              Zuvo is not a medical device. All information is for educational purposes only.
              Always consult a qualified healthcare professional for medical decisions.
            </p>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
