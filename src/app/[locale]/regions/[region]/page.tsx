import type { Metadata } from "next";
import { Link } from "@/navigation";
import { notFound } from "next/navigation";
import {
  ChevronLeft, MapPin, Phone, Users, AlertTriangle,
  Heart, Building2, Globe, Shield, Activity,
} from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { REGIONS, type RegionData } from "@/data/regions";

type Props = {
  params: Promise<{ locale: string; region: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region } = await params;
  const data = REGIONS.find((r) => r.id === region);
  if (!data) return {};
  return { title: `Roma Health — ${data.id.charAt(0).toUpperCase() + data.id.slice(1)} — Sastipe` };
}

export async function generateStaticParams() {
  return REGIONS.map((r) => ({ region: r.id }));
}

const HEALTH_INDEX_LABELS = ["Very poor", "Poor", "Fair", "Good", "Excellent"];
const HEALTH_INDEX_COLORS = ["#DC2626", "#F97316", "#F59E0B", "#22C55E", "#16A34A"];

function HealthBar({ index }: { index: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-2 flex-1 rounded-full"
          style={{ backgroundColor: i <= index ? HEALTH_INDEX_COLORS[index - 1] : "#E5E7EB" }}
        />
      ))}
    </div>
  );
}

const ORG_ICONS = {
  ngo: Heart,
  government: Building2,
  international: Globe,
};

export default async function RegionPage({ params }: Props) {
  const { region } = await params;
  const data = REGIONS.find((r) => r.id === region);
  if (!data) notFound();

  const regionName = data.id.charAt(0).toUpperCase() + data.id.slice(1);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F7]">
      <Header />
      <SosButton />
      <main id="main-content" className="flex-1 pb-2">
        <div className="px-4 py-4">
          <Link href="/" className="mb-4 inline-flex items-center gap-1 text-[13px] font-semibold text-gray-500">
            <ChevronLeft className="h-4 w-4" /> Back
          </Link>

          {/* Header card */}
          <div className="mb-4 overflow-hidden rounded-2xl bg-white shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.04)" }}>
            <div className="p-5" style={{ background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)" }}>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{data.flag}</span>
                <div>
                  <h1 className="text-xl font-black text-white">{regionName}</h1>
                  <p className="text-[13px] text-gray-400">{data.capitalCity}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-gray-50 p-4">
              <div className="pr-4">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400">
                  <Users className="h-3.5 w-3.5" /> Roma population
                </div>
                <span className="text-lg font-black text-gray-900">{data.romaPopulation}</span>
                <p className="text-[11px] text-gray-400">of {data.totalPopulation} total ({data.percentRoma})</p>
              </div>
              <div className="pl-4">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400">
                  <Activity className="h-3.5 w-3.5" /> Health access
                </div>
                <div className="mt-1 mb-1">
                  <HealthBar index={data.healthIndex} />
                </div>
                <p className="text-[11px] font-semibold" style={{ color: HEALTH_INDEX_COLORS[data.healthIndex - 1] }}>
                  {HEALTH_INDEX_LABELS[data.healthIndex - 1]}
                </p>
              </div>
            </div>
          </div>

          {/* Key fact */}
          <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-[13px] font-bold leading-relaxed text-amber-800">
              💡 {data.keyFact}
            </p>
          </div>

          {/* Emergency */}
          <a
            href={`tel:${data.emergencyNumber}`}
            className="mb-4 flex items-center gap-3 rounded-2xl p-4 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)" }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-[15px] font-black text-white">Emergency: {data.emergencyNumber}</span>
              <p className="text-[12px] text-red-200">Ambulance: {data.ambulanceNumber}</p>
            </div>
          </a>

          {/* Health challenges */}
          <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.04)" }}>
            <h2 className="mb-3 flex items-center gap-2 text-[14px] font-black text-gray-900">
              <AlertTriangle className="h-4 w-4 text-red-500" /> Health challenges
            </h2>
            <div className="space-y-2">
              {data.healthChallenges.map((challenge, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-400" />
                  <p className="text-[13px] leading-relaxed text-gray-700">{challenge}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Organizations */}
          <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.04)" }}>
            <h2 className="mb-3 flex items-center gap-2 text-[14px] font-black text-gray-900">
              <Shield className="h-4 w-4 text-blue-500" /> Organizations that can help
            </h2>
            <div className="space-y-3">
              {data.organizations.map((org, i) => {
                const OrgIcon = ORG_ICONS[org.type];
                return (
                  <div key={i} className="rounded-xl bg-gray-50 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <OrgIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-[13px] font-bold text-gray-800">{org.name}</span>
                    </div>
                    <p className="text-[12px] text-gray-500">{org.focus}</p>
                    {org.phone && (
                      <a href={`tel:${org.phone}`} className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold text-[#C0392B]">
                        <Phone className="h-3 w-3" /> {org.phone}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/chat"
            className="flex h-[48px] items-center justify-center gap-2 rounded-2xl text-[14px] font-bold text-white active:scale-[0.97]"
            style={{ background: "linear-gradient(135deg, #C0392B 0%, #E74C3C 100%)" }}
          >
            <MapPin className="h-4 w-4" /> Ask about health in {regionName}
          </Link>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
