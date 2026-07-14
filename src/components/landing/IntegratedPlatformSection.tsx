import {
  MessageCircle,
  Search,
  Activity,
  FileText,
  Users,
  Shield,
  Globe,
  Mic,
  BarChart3,
  MapPin,
  Syringe,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

const CAPABILITIES = [
  { key: "chat", icon: MessageCircle, tone: "green" },
  { key: "scan", icon: Search, tone: "blue" },
  { key: "symptoms", icon: Activity, tone: "green" },
  { key: "records", icon: FileText, tone: "blue" },
  { key: "family", icon: Users, tone: "green" },
  { key: "mediator", icon: Shield, tone: "blue" },
  { key: "languages", icon: Globe, tone: "green" },
  { key: "voice", icon: Mic, tone: "blue" },
  { key: "impact", icon: BarChart3, tone: "green" },
  { key: "navigate", icon: MapPin, tone: "blue" },
  { key: "vaccines", icon: Syringe, tone: "green" },
] as const;

const toneStyles = {
  green: "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]",
  blue: "bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]",
};

/**
 * Dawa-style integrated platform capability strip.
 */
export async function IntegratedPlatformSection() {
  const t = await getTranslations("landing");

  return (
    <section
      aria-labelledby="integrated-platform-title"
      className="border-y border-[var(--color-border-subtle)] bg-white py-12 md:py-16"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <header className="mb-10 text-center md:mb-12">
          <p className="eyebrow justify-center">{t("integratedEyebrow")}</p>
          <h2
            id="integrated-platform-title"
            className="font-editorial mx-auto mt-3 max-w-3xl font-medium leading-[1.05] text-[var(--color-text-primary)]"
            style={{ fontSize: "clamp(1.75rem, 1.2rem + 1.8vw, 2.75rem)" }}
          >
            {t("integratedTitle")}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base">
            {t("integratedLead")}
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-2.5 md:gap-3">
          {CAPABILITIES.map(({ key, icon: Icon, tone }) => (
            <span
              key={key}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold md:text-sm ${toneStyles[tone]}`}
            >
              <Icon className="lucide h-3.5 w-3.5" strokeWidth={2.2} />
              {t(`integrated${key.charAt(0).toUpperCase() + key.slice(1)}` as "integratedChat")}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
