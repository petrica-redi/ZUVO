import Image from "next/image";
import { Link } from "@/navigation";
import { Brain, Search, Activity, Mic, Shield, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

const TOOLS = [
  {
    id: "ai",
    icon: Brain,
    image: "/images/ai/chat-companion.svg",
    gradient: "from-[#0A1220] to-[#0E8074]",
  },
  {
    id: "scan",
    icon: Search,
    image: "/images/surfaces/scan.png",
    gradient: "from-[#0F3D38] to-[#0E8074]",
  },
  {
    id: "triage",
    icon: Activity,
    image: "/images/surfaces/symptoms.png",
    gradient: "from-[#0E8074] to-[#14B8A6]",
  },
  {
    id: "voice",
    icon: Mic,
    image: "/images/ai/ai-audience-community.png",
    gradient: "from-[#134E4A] to-[#0E8074]",
  },
] as const;

/**
 * Technology showcase — AI, screening, triage, voice.
 */
export async function TechnologyShowcase() {
  const t = await getTranslations("landing");

  return (
    <section aria-labelledby="tech-title" className="section-marketing">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <header className="mb-10 max-w-2xl md:mb-14">
          <p className="eyebrow">{t("techEyebrow")}</p>
          <h2
            id="tech-title"
            className="font-headline mt-3 leading-[1.05] text-[var(--color-text-primary)]"
            style={{ fontSize: "clamp(1.875rem, 1.3rem + 1.8vw, 3rem)" }}
          >
            {t("techTitle")}
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base">
            {t("techLead")}
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          {TOOLS.map(({ id, icon: Icon, image, gradient }) => (
            <article
              key={id}
              className="group overflow-hidden rounded-3xl border border-[var(--color-border-subtle)] bg-white shadow-2 transition-all hover:shadow-3"
            >
              <div className="grid md:grid-cols-[1fr_140px]">
                <div className="p-6 md:p-8">
                  <div
                    className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white`}
                  >
                    <Icon className="lucide h-5 w-5" strokeWidth={2} />
                  </div>
                  <h3 className="font-display text-lg font-extrabold text-[var(--color-text-primary)]">
                    {t(`tech${id.charAt(0).toUpperCase() + id.slice(1)}Title` as "techAiTitle")}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {t(`tech${id.charAt(0).toUpperCase() + id.slice(1)}Body` as "techAiBody")}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {[1, 2, 3].map((n) => (
                      <li
                        key={n}
                        className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-[11px] font-bold text-[var(--color-accent-text)]"
                      >
                        {t(`tech${id.charAt(0).toUpperCase() + id.slice(1)}Tag${n}` as "techAiTag1")}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative hidden min-h-[160px] md:block">
                  <Image
                    src={image}
                    alt=""
                    fill
                    className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                    sizes="140px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent" />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] p-8 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-ink-900)] text-white">
              <Shield className="lucide h-6 w-6" strokeWidth={2} />
            </div>
            <div>
              <p className="font-display text-lg font-extrabold text-[var(--color-text-primary)]">
                {t("techPrivacyTitle")}
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {t("techPrivacyBody")}
              </p>
            </div>
          </div>
          <Link
            href="/#stakeholder-access"
            className="admin-btn-primary inline-flex shrink-0 items-center gap-2 px-6 py-3 text-sm"
          >
            {t("techDemoCta")}
            <ArrowRight className="lucide h-4 w-4" strokeWidth={2.2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
