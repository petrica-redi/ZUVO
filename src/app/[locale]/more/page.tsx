import type { Metadata } from "next";
import { Link } from "@/navigation";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import {
  Search, Stethoscope, Syringe, Navigation, BookOpen,
  MapPin, Shield, User, Settings, ChevronRight, Heart, Activity,
  Scale, GraduationCap,
} from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(): Promise<Metadata> {
  return { title: "More — Zuvo", description: "All Zuvo features" };
}

const SECTIONS = [
  {
    title: "Health Tools",
    items: [
      { href: "/scan", icon: Search, label: "Misinformation Scanner", desc: "Fact-check health claims", color: "#F59E0B", gradient: "from-amber-400 to-orange-500" },
      { href: "/symptoms", icon: Activity, label: "Symptom Checker", desc: "Tap where it hurts", color: "#EF4444", gradient: "from-red-500 to-rose-600" },
      { href: "/consult", icon: Stethoscope, label: "Health Consultation", desc: "AI-guided check-up", color: "#8B5CF6", gradient: "from-violet-500 to-purple-600" },
      { href: "/vaccines", icon: Syringe, label: "Vaccine Guide", desc: "Every vaccine explained", color: "#10B981", gradient: "from-emerald-500 to-green-600" },
      { href: "/navigate", icon: Navigation, label: "Healthcare Navigator", desc: "Find a doctor, know your rights", color: "#06B6D4", gradient: "from-cyan-500 to-blue-600" },
    ],
  },
  {
    title: "Learn & Grow",
    items: [
      { href: "/learn", icon: BookOpen, label: "Health Topics", desc: "6 health zones with lessons", color: "#3B82F6", gradient: "from-blue-500 to-indigo-600" },
      { href: "/quiz", icon: GraduationCap, label: "Health Quiz", desc: "Test your knowledge", color: "#F59E0B", gradient: "from-amber-500 to-orange-600" },
      { href: "/glossary", icon: BookOpen, label: "Health Glossary", desc: "Medical terms explained simply", color: "#0D9488", gradient: "from-teal-500 to-cyan-600" },
      { href: "/rights", icon: Scale, label: "Know Your Rights", desc: "Patient rights & legal help", color: "#8B5CF6", gradient: "from-indigo-500 to-purple-600" },
      { href: "/stories", icon: Heart, label: "Community Stories", desc: "Real experiences from Roma families", color: "#EC4899", gradient: "from-rose-500 to-pink-600" },
      { href: "/regions/romania", icon: MapPin, label: "Roma Communities", desc: "Health info by country", color: "#C0392B", gradient: "from-red-500 to-red-700" },
    ],
  },
  {
    title: "Professional",
    items: [
      { href: "/mediator", icon: Shield, label: "Mediator Dashboard", desc: "Tools for health mediators", color: "#7C3AED", gradient: "from-purple-500 to-indigo-600" },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/profile", icon: User, label: "Profile", desc: "Language, progress, data", color: "#64748B", gradient: "from-gray-500 to-gray-600" },
      { href: "/about", icon: Settings, label: "About Zuvo", desc: "Version, privacy, contact", color: "#94A3B8", gradient: "from-gray-400 to-gray-500" },
    ],
  },
];

export default async function MorePage({ params }: Props) {
  await params;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F7]">
      <Header />
      <SosButton />
      <main id="main-content" className="flex-1 pb-2">
        <div className="px-5 py-6">
          <h1 className="mb-6 text-2xl font-black text-gray-900 animate-fade-in-up">All Features</h1>

          {SECTIONS.map((section, si) => (
            <div key={section.title} className={`mb-6 animate-fade-in-up delay-${(si + 1) * 100}`}>
              <h2 className="mb-3 text-xs font-black uppercase tracking-widest text-gray-400">
                {section.title}
              </h2>
              <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                {section.items.map((item, i) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-4 px-5 py-4 transition-all active:bg-gray-50 ${
                      i > 0 ? "border-t border-gray-50" : ""
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} shadow-md`}
                    >
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-bold text-gray-800">{item.label}</span>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-300" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
