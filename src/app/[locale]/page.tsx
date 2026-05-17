import type { Metadata } from "next";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Activity,
  Search,
  GraduationCap,
  Users,
  BarChart3,
  Heart,
  Phone,
  Stethoscope,
  Globe,
  Lock,
  CheckCircle2,
  Brain,
  MessageCircle,
  Syringe,
  MapPin,
} from "lucide-react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ProfileShellOptOut } from "@/components/landing/ProfileShellOptOut";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("title"), description: t("description") };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing" });
  const tHome = await getTranslations({ locale, namespace: "home" });

  return (
    <>
      {/* Opt the root mobile-shell out of the phone-frame so the home page
          renders as a true full-width premium landing on desktop. */}
      <ProfileShellOptOut />

      <LandingHeader />

      <main id="main-content" className="relative">
        {/* ===== HERO ============================================== */}
        <section className="relative overflow-hidden">
          {/* Atmospheric backdrop */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 70% 0%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 0% 100%, rgba(110,140,94,0.10) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 100% 100%, rgba(251,191,36,0.06) 0%, transparent 60%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 grain-overlay opacity-60"
          />

          <div className="mx-auto max-w-6xl px-5 pb-16 pt-12 md:px-8 md:pb-28 md:pt-24">
            <div className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
              <div>
                <span className="eyebrow animate-fade-in-up">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: "var(--color-accent)" }}
                  />
                  {t("eyebrow")}
                </span>

                <h1
                  className="font-editorial mt-5 font-medium leading-[0.95] text-[var(--color-text-primary)] animate-fade-in-up delay-100"
                  style={{
                    fontSize: "clamp(2.75rem, 1.6rem + 5vw, 5.5rem)",
                  }}
                >
                  <span>{t("heroLine1")}</span>
                  <br />
                  <span className="italic" style={{ fontFeatureSettings: '"ss01" on' }}>
                    {t("heroLine2")}
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[var(--color-text-secondary)] md:text-lg animate-fade-in-up delay-200">
                  {t("heroLead")}
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-3 animate-fade-in-up delay-300">
                  <Link
                    href="/chat"
                    className="group inline-flex h-13 items-center gap-2 rounded-full px-7 py-4 text-sm font-extrabold text-white gradient-brand grain-overlay shadow-brand transition-all hover:shadow-4 active:scale-[0.97]"
                    style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
                  >
                    {t("ctaPrimary")}
                    <ArrowRight
                      className="lucide h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      strokeWidth={2.2}
                    />
                  </Link>
                  <Link
                    href="/methodology"
                    className="inline-flex h-13 items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-6 py-4 text-sm font-extrabold text-[var(--color-text-primary)] transition-all hover:border-[var(--color-text-primary)]"
                  >
                    {t("ctaSecondary")}
                  </Link>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[var(--color-text-muted)] animate-fade-in-up delay-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="lucide h-3.5 w-3.5 text-[var(--color-success-accent)]" strokeWidth={2} />
                    {t("trustBadge1")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Globe className="lucide h-3.5 w-3.5" strokeWidth={2} />
                    {t("trustBadge2")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Lock className="lucide h-3.5 w-3.5" strokeWidth={2} />
                    {t("trustBadge3")}
                  </span>
                </div>
              </div>

              {/* Hero composition — refined illustration card */}
              <HeroComposition t={t} />
            </div>
          </div>
        </section>

        {/* ===== PLATFORM NAV DECK ================================ */}
        {/* Six-tile wayfinding band — the front door to every tool. */}
        <section
          aria-labelledby="platform-nav-title"
          className="relative border-t border-[var(--color-border-subtle)] bg-[var(--color-surface)]"
        >
          <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
            <header className="mb-8 flex flex-col gap-3 md:mb-10 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: "var(--color-accent)" }}
                  />
                  {t("navTitle")}
                </p>
                <h2
                  id="platform-nav-title"
                  className="font-editorial mt-3 font-medium leading-[1.05] text-[var(--color-text-primary)]"
                  style={{ fontSize: "clamp(1.5rem, 1.1rem + 1.4vw, 2rem)" }}
                >
                  {t("navSubtitle")}
                </h2>
              </div>
              <a
                href="tel:112"
                className="hidden items-center gap-2 self-start rounded-full border border-[var(--color-danger-accent)]/30 bg-[var(--color-danger-bg)] px-4 py-2 text-xs font-extrabold text-[var(--color-danger-text)] transition-all hover:bg-[var(--color-danger-accent)] hover:text-white md:inline-flex"
              >
                <Phone className="lucide h-3.5 w-3.5" strokeWidth={2.4} />
                {tHome("emergencyCta")}
              </a>
            </header>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              <PlatformTile
                href="/chat"
                icon={MessageCircle}
                accent="brand"
                title={t("navAsk")}
                desc={t("navAskDesc")}
                primary
              />
              <PlatformTile
                href="/scan"
                icon={Search}
                accent="ember"
                title={t("navScan")}
                desc={t("navScanDesc")}
                primary
              />
              <PlatformTile
                href="/symptoms"
                icon={Activity}
                accent="sage"
                title={t("navSymptoms")}
                desc={t("navSymptomsDesc")}
              />
              <PlatformTile
                href="/vaccines"
                icon={Syringe}
                accent="brand"
                title={t("navVaccines")}
                desc={t("navVaccinesDesc")}
              />
              <PlatformTile
                href="/students"
                icon={GraduationCap}
                accent="ember"
                title={t("navAcademy")}
                desc={t("navAcademyDesc")}
              />
              <PlatformTile
                href="/providers"
                icon={MapPin}
                accent="sage"
                title={t("navProviders")}
                desc={t("navProvidersDesc")}
              />
            </div>
          </div>
        </section>

        {/* ===== TRUST STRIP ====================================== */}
        <section className="border-y border-[var(--color-border-subtle)] bg-[var(--color-cream-50)] py-7 md:py-10">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              {t("trustEyebrow")}
            </p>
            <div className="mt-7 grid grid-cols-2 gap-y-4 text-center md:grid-cols-4">
              <Stat value="15" label={t("statLanguages")} />
              <Stat value="45" label={t("statMediators")} />
              <Stat value="12.4k" label={t("statMyths")} />
              <Stat value="850" label={t("statEmergencies")} />
            </div>
          </div>
        </section>

        {/* ===== AUDIENCE TRIPTYCH ================================ */}
        <section className="section-marketing">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <header className="mb-12 max-w-2xl md:mb-16">
              <p className="eyebrow">{t("audienceEyebrow")}</p>
              <h2
                className="font-editorial mt-3 font-medium leading-[1.05] text-[var(--color-text-primary)]"
                style={{ fontSize: "clamp(2rem, 1.4rem + 2vw, 3.25rem)" }}
              >
                {t("audienceTitle")}
              </h2>
            </header>

            <div className="grid gap-5 md:grid-cols-3 md:gap-6">
              <AudienceCard
                accent="brand"
                icon={GraduationCap}
                title={t("studentTitle")}
                lead={t("studentLead")}
                cta={t("studentCta")}
                href="/students"
                kicker={t("audienceKickerStudents")}
              />
              <AudienceCard
                accent="sage"
                icon={Users}
                title={t("communityTitle")}
                lead={t("communityLead")}
                cta={t("communityCta")}
                href="/providers"
                kicker={t("audienceKickerCommunity")}
              />
              <AudienceCard
                accent="ember"
                icon={BarChart3}
                title={t("ministerTitle")}
                lead={t("ministerLead")}
                cta={t("ministerCta")}
                href="/impact"
                kicker={t("audienceKickerPartners")}
              />
            </div>
          </div>
        </section>

        {/* ===== FEATURES GRID ==================================== */}
        <section className="section-marketing bg-[var(--color-surface)]">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <header className="mb-10 max-w-2xl md:mb-14">
              <p className="eyebrow">{t("featuresEyebrow")}</p>
              <h2
                className="font-editorial mt-3 font-medium leading-[1.05] text-[var(--color-text-primary)]"
                style={{ fontSize: "clamp(1.875rem, 1.3rem + 1.8vw, 3rem)" }}
              >
                {t("featuresTitle")}
              </h2>
            </header>

            <div className="grid gap-5 md:grid-cols-2 md:gap-6">
              <FeatureRow icon={Search} title={t("feat1Title")} body={t("feat1Body")} />
              <FeatureRow icon={Activity} title={t("feat2Title")} body={t("feat2Body")} />
              <FeatureRow icon={Stethoscope} title={t("feat3Title")} body={t("feat3Body")} />
              <FeatureRow icon={ShieldCheck} title={t("feat4Title")} body={t("feat4Body")} />
            </div>
          </div>
        </section>

        {/* ===== IMPACT + METHODOLOGY (split editorial) =========== */}
        <section className="section-marketing">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="grid gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <p className="eyebrow">{t("impactEyebrow")}</p>
                <h2
                  className="font-editorial mt-3 font-medium leading-[1.05] text-[var(--color-text-primary)]"
                  style={{ fontSize: "clamp(1.75rem, 1.2rem + 1.8vw, 2.5rem)" }}
                >
                  {t("impactTitle")}
                </h2>
                <ul className="mt-7 space-y-4 text-sm text-[var(--color-text-secondary)]">
                  <ImpactRow icon={Heart} label={t("impactRow1")} value="42" />
                  <ImpactRow icon={Brain} label={t("impactRow2")} value="3,180" />
                  <ImpactRow icon={CheckCircle2} label={t("impactRow3")} value="1,205" />
                </ul>
                <Link
                  href="/impact"
                  className="mt-8 inline-flex items-center gap-1.5 text-sm font-extrabold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
                >
                  {t("impactCta")}
                  <ArrowRight className="lucide h-4 w-4" strokeWidth={2.2} />
                </Link>
              </div>

              <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-cream-50)] p-7 md:p-10">
                <p className="eyebrow">{t("methodologyEyebrow")}</p>
                <h2
                  className="font-editorial mt-3 font-medium leading-[1.05] text-[var(--color-ink-900)]"
                  style={{ fontSize: "clamp(1.5rem, 1.1rem + 1.4vw, 2rem)" }}
                >
                  {t("methodologyTitle")}
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {t("methodologyBody")}
                </p>
                <div className="mt-6 grid grid-cols-3 gap-2 text-[11px]">
                  <SafetyChip label={t("safetyRedFlags")} />
                  <SafetyChip label={t("safetyPII")} />
                  <SafetyChip label={t("safetyClinical")} />
                </div>
                <Link
                  href="/methodology"
                  className="mt-8 inline-flex items-center gap-1.5 text-sm font-extrabold text-[var(--color-text-primary)] hover:text-[var(--color-accent)]"
                >
                  {t("methodologyCta")}
                  <ArrowRight className="lucide h-4 w-4" strokeWidth={2.2} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== EMERGENCY STRIP ================================== */}
        <section className="mx-auto max-w-6xl px-5 md:px-8">
          <a
            href="tel:112"
            className="flex items-center gap-4 rounded-3xl bg-[var(--color-ink-900)] p-5 transition-transform hover:translate-y-[-2px] md:p-6"
            style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl gradient-emergency grain-overlay shadow-danger">
              <Phone className="lucide h-5 w-5 text-white" strokeWidth={2.2} />
            </div>
            <div className="flex-1">
              <p className="font-display text-base font-extrabold text-white md:text-lg">
                {tHome("emergencyCta")}
              </p>
              <p className="text-xs text-white/60 md:text-sm">
                {tHome("emergencySub")}
              </p>
            </div>
            <ArrowRight className="lucide h-5 w-5 text-white/60" strokeWidth={2} />
          </a>
        </section>

        {/* ===== FINAL CTA ======================================== */}
        <section className="section-marketing">
          <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
            <p className="eyebrow justify-center">{t("finalEyebrow")}</p>
            <h2
              className="font-editorial mt-4 font-medium leading-[1.05] text-[var(--color-text-primary)]"
              style={{ fontSize: "clamp(2rem, 1.5rem + 2.5vw, 3.75rem)" }}
            >
              {t("finalTitle")}
            </h2>
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base">
              {t("finalBody")}
            </p>
            <Link
              href="/chat"
              className="mt-8 inline-flex h-13 items-center gap-2 rounded-full px-7 py-4 text-sm font-extrabold text-white gradient-brand grain-overlay shadow-brand transition-all hover:shadow-4 active:scale-[0.97]"
            >
              {t("finalCta")}
              <Sparkles className="lucide h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </section>
      </main>

      <LandingFooter locale={locale} />
    </>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div
        className="font-editorial text-[var(--color-text-primary)]"
        style={{ fontSize: "clamp(1.875rem, 1.4rem + 2vw, 2.75rem)" }}
      >
        {value}
      </div>
      <div className="mt-1 text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
        {label}
      </div>
    </div>
  );
}

const AUDIENCE_THEMES = {
  brand: {
    bg: "bg-[var(--color-brand-50)]",
    border: "border-[var(--color-brand-200)]",
    icon: "text-[var(--color-brand-700)] bg-white",
    chip: "bg-[var(--color-brand-100)] text-[var(--color-brand-800)]",
  },
  sage: {
    bg: "bg-[var(--color-sage-50)]",
    border: "border-[var(--color-sage-200)]",
    icon: "text-[var(--color-sage-700)] bg-white",
    chip: "bg-[var(--color-sage-100)] text-[var(--color-sage-800)]",
  },
  ember: {
    bg: "bg-[var(--color-ember-50)]",
    border: "border-[var(--color-ember-200)]",
    icon: "text-[var(--color-ember-700)] bg-white",
    chip: "bg-[var(--color-ember-100)] text-[var(--color-ember-800)]",
  },
} as const;

function AudienceCard({
  accent,
  icon: Icon,
  title,
  lead,
  cta,
  href,
  kicker,
}: {
  accent: keyof typeof AUDIENCE_THEMES;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  lead: string;
  cta: string;
  href: string;
  kicker: string;
}) {
  const theme = AUDIENCE_THEMES[accent];
  return (
    <Link
      href={href}
      className={`group relative flex flex-col rounded-3xl border ${theme.border} ${theme.bg} p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-3 md:p-8`}
      style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${theme.icon} shadow-1`}
        >
          <Icon className="lucide h-5 w-5" strokeWidth={1.85} />
        </div>
        <span
          className={`inline-flex items-center rounded-full ${theme.chip} px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest`}
        >
          {kicker}
        </span>
      </div>

      <h3
        className="font-editorial mt-7 font-medium leading-tight text-[var(--color-text-primary)]"
        style={{ fontSize: "clamp(1.25rem, 1rem + 0.8vw, 1.625rem)" }}
      >
        {title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {lead}
      </p>

      <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-extrabold text-[var(--color-text-primary)]">
        {cta}
        <ArrowRight
          className="lucide h-4 w-4 transition-transform group-hover:translate-x-0.5"
          strokeWidth={2.2}
        />
      </span>
    </Link>
  );
}

function FeatureRow({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-canvas)] p-6 md:p-7">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-1">
        <Icon className="lucide h-5 w-5" strokeWidth={1.85} />
      </div>
      <div>
        <h3 className="font-display text-base font-extrabold tracking-tight text-[var(--color-text-primary)]">
          {title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {body}
        </p>
      </div>
    </div>
  );
}

function ImpactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-center gap-4 rounded-2xl bg-[var(--color-surface)] px-5 py-4 shadow-1">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent-text)]">
        <Icon className="lucide h-4 w-4" strokeWidth={2} />
      </div>
      <span className="flex-1 text-sm">{label}</span>
      <span
        className="font-editorial text-[var(--color-text-primary)]"
        style={{ fontSize: "clamp(1.25rem, 1.1rem + 0.4vw, 1.5rem)" }}
      >
        {value}
      </span>
    </li>
  );
}

function SafetyChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center justify-center gap-1 rounded-full border border-[var(--color-border-default)] bg-white py-1.5 font-extrabold uppercase tracking-widest text-[var(--color-text-secondary)]">
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: "var(--color-success-accent)" }}
      />
      {label}
    </span>
  );
}

const TILE_THEMES = {
  brand: {
    iconBg: "bg-[var(--color-brand-100)]",
    iconText: "text-[var(--color-brand-700)]",
    ring: "hover:border-[var(--color-brand-400)]",
    primaryBg: "bg-[var(--color-brand-50)]",
  },
  sage: {
    iconBg: "bg-[var(--color-sage-100)]",
    iconText: "text-[var(--color-sage-700)]",
    ring: "hover:border-[var(--color-sage-400)]",
    primaryBg: "bg-[var(--color-sage-50)]",
  },
  ember: {
    iconBg: "bg-[var(--color-ember-100)]",
    iconText: "text-[var(--color-ember-700)]",
    ring: "hover:border-[var(--color-ember-400)]",
    primaryBg: "bg-[var(--color-ember-50)]",
  },
} as const;

function PlatformTile({
  href,
  icon: Icon,
  title,
  desc,
  accent,
  primary = false,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  desc: string;
  accent: keyof typeof TILE_THEMES;
  primary?: boolean;
}) {
  const theme = TILE_THEMES[accent];
  return (
    <Link
      href={href}
      className={`group relative flex h-full items-start gap-3.5 rounded-2xl border border-[var(--color-border-subtle)] ${primary ? theme.primaryBg : "bg-[var(--color-bg-canvas)]"} ${theme.ring} p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2 md:gap-4 md:rounded-3xl md:p-5`}
      style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
    >
      <div
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${theme.iconBg} ${theme.iconText} shadow-1 md:h-11 md:w-11 md:rounded-2xl`}
      >
        <Icon className="lucide h-5 w-5" strokeWidth={1.9} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-display text-[13px] font-extrabold leading-tight tracking-tight text-[var(--color-text-primary)] md:text-[15px]">
          {title}
        </span>
        <span className="mt-1 hidden text-[12px] leading-snug text-[var(--color-text-secondary)] md:block">
          {desc}
        </span>
      </div>
      <ArrowRight
        className="lucide mt-1 h-4 w-4 flex-shrink-0 text-[var(--color-text-muted)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--color-text-primary)]"
        strokeWidth={2}
        aria-hidden
      />
    </Link>
  );
}

function HeroComposition({ t }: { t: (key: string) => string }) {
  return (
    <div className="relative">
      {/* Main card */}
      <div className="relative rounded-[32px] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-7 shadow-4 md:p-9">
        {/* Browser-chrome dots */}
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-danger-accent)]/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-warning-accent)]/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-success-accent)]/40" />
          <span className="ml-3 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            {t("heroCardLabel")}
          </span>
        </div>

        {/* Fake conversation */}
        <div className="mt-6 space-y-4">
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-[var(--color-text-primary)] px-4 py-3 text-sm text-[var(--color-bg-canvas)]">
            {t("heroCardQuestion")}
          </div>
          <div className="max-w-[90%] rounded-2xl rounded-bl-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-canvas)] px-4 py-3 text-sm leading-relaxed text-[var(--color-text-primary)]">
            <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-[var(--color-success-bg)] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-success-text)]">
              <CheckCircle2 className="lucide h-3 w-3" strokeWidth={2.2} /> {t("heroCardVerdict")}
            </span>
            <div className="mt-1">{t("heroCardAnswer")}</div>
          </div>
        </div>

        {/* Footer stat row */}
        <div className="mt-7 flex items-center gap-2 border-t border-[var(--color-border-subtle)] pt-5 text-xs text-[var(--color-text-muted)]">
          <ShieldCheck className="lucide h-3.5 w-3.5 text-[var(--color-success-accent)]" strokeWidth={2} />
          {t("heroCardFooter")}
        </div>
      </div>

      {/* Floating sage badge — sits low-left, clear of the card footer copy */}
      <div
        className="absolute -bottom-8 left-2 rounded-2xl border border-[var(--color-sage-200)] bg-[var(--color-sage-50)] px-4 py-3 shadow-2 md:-bottom-10 md:left-0"
        aria-hidden
      >
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-sage-700)]">
          {t("heroBadgeAvailable")}
        </div>
        <div className="font-editorial mt-1 text-2xl leading-none text-[var(--color-sage-900)]">
          {t("heroBadgeLanguages")}
        </div>
      </div>

      {/* Floating ember badge */}
      <div
        className="absolute -right-3 -top-3 rounded-2xl border border-[var(--color-ember-200)] bg-[var(--color-ember-50)] px-3.5 py-2.5 shadow-2"
        aria-hidden
      >
        <div className="flex items-center gap-1.5">
          <Sparkles className="lucide h-3.5 w-3.5 text-[var(--color-ember-600)]" strokeWidth={2} />
          <span className="text-[11px] font-extrabold text-[var(--color-ember-800)]">
            {t("heroBadgeMix")}
          </span>
        </div>
      </div>
    </div>
  );
}
