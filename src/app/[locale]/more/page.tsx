import type { Metadata } from "next";
import { Link } from "@/navigation";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import {
  Search, Stethoscope, Syringe, Navigation, BookOpen,
  MapPin, Shield, User, Settings, ChevronRight, Heart,
} from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(): Promise<Metadata> {
  return { title: "More — Zuvo", description: "All Zuvo features" };
}

const SECTIONS = [
  {
    title: "Health Tools",
    items: [
      { href: "/scan", icon: Search, label: "Misinformation Scanner", desc: "Fact-check health claims", color: "#F59E0B" },
      { href: "/symptoms", icon: Stethoscope, label: "Symptom Checker", desc: "Tap where it hurts", color: "#EF4444" },
      { href: "/consult", icon: Heart, label: "Health Consultation", desc: "AI-guided check-up", color: "#8B5CF6" },
      { href: "/vaccines", icon: Syringe, label: "Vaccine Guide", desc: "Every vaccine explained", color: "#10B981" },
      { href: "/navigate", icon: Navigation, label: "Healthcare Navigator", desc: "Find a doctor, know your rights", color: "#06B6D4" },
    ],
  },
  {
    title: "Learn",
    items: [
      { href: "/learn", icon: BookOpen, label: "Health Topics", desc: "6 health zones with lessons", color: "#3B82F6" },
      { href: "/regions/romania", icon: MapPin, label: "Roma Communities", desc: "Health info by country", color: "#C0392B" },
    ],
  },
  {
    title: "Professional",
    items: [
      { href: "/mediator", icon: Shield, label: "Mediator Dashboard", desc: "Tools for health mediators", color: "#7C3AED" },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/profile", icon: User, label: "Profile", desc: "Language, progress, data", color: "#64748B" },
      { href: "/about", icon: Settings, label: "About Zuvo", desc: "Version, privacy, contact", color: "#94A3B8" },
    ],
  },
];

export default async function MorePage({ params }: Props) {
  await params;

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7]">
      <Header />
      <main className="flex-1 pb-28 pt-14">
        <div className="mx-auto max-w-lg px-5 py-6">
          <h1 className="mb-6 text-xl font-bold text-gray-900">More</h1>

          {SECTIONS.map((section) => (
            <div key={section.title} className="mb-6">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {section.title}
              </h2>
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                {section.items.map((item, i) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3.5 transition-colors active:bg-gray-50 ${
                      i > 0 ? "border-t border-gray-50" : ""
                    }`}
                  >
                    <div
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: item.color + "15" }}
                    >
                      <item.icon className="h-4.5 w-4.5" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-gray-800">{item.label}</span>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-300" />
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
