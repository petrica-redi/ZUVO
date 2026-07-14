import { Link } from "@/navigation";
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
  HandHeart,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

const CAPABILITIES = [
  { key: "chat", icon: MessageCircle, tone: "green", href: "/chat" },
  { key: "scan", icon: Search, tone: "blue", href: "/scan" },
  { key: "symptoms", icon: Activity, tone: "green", href: "/symptoms" },
  { key: "records", icon: FileText, tone: "blue", href: "/explain" },
  { key: "family", icon: Users, tone: "green", href: "/family" },
  { key: "help", icon: HandHeart, tone: "blue", href: "/help" },
  { key: "mediator", icon: Shield, tone: "blue", href: "/mediator" },
  { key: "languages", icon: Globe, tone: "green", href: "/about" },
  { key: "voice", icon: Mic, tone: "blue", href: "/chat" },
  { key: "impact", icon: BarChart3, tone: "green", href: "/impact" },
  { key: "navigate", icon: MapPin, tone: "blue", href: "/providers" },
  { key: "vaccines", icon: Syringe, tone: "green", href: "/vaccines" },
] as const;

const toneStyles = {
  green: "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0] hover:bg-[#D1FAE5]",
  blue: "bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE] hover:bg-[#DBEAFE]",
};

/**
 * Integrated platform capability strip — each chip links to a real route.
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
          {CAPABILITIES.map(({ key, icon: Icon, tone, href }) => (
            <Link
              key={key}
              href={href}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-colors md:text-sm ${toneStyles[tone]}`}
            >
              <Icon className="lucide h-3.5 w-3.5" strokeWidth={2.2} />
              {key === "help"
                ? t("integratedHelp")
                : t(`integrated${key.charAt(0).toUpperCase() + key.slice(1)}` as "integratedChat")}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
