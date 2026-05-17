import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAppConfig } from "@/lib/env";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { MapPin, CheckCircle2, ShieldCheck, HeartPulse, Building2, Map } from "lucide-react";
import { Card, Badge } from "@/components/ui";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "providers" });
  const { appName } = getAppConfig();
  return { title: `${t("title")} — ${appName}`, description: t("subtitle") };
}

// Dummy data for the provider directory. In a real app this would be fetched from the DB.
const PROVIDERS = [
  {
    id: "p1",
    name: "Clinica Sfânta Maria",
    city: "Bucharest",
    type: "General Clinic",
    isRomaFriendly: true,
    isFree: true,
    hasInterpreter: true,
    distance: "2.4 km",
  },
  {
    id: "p2",
    name: "Centrul de Sănătate Ferentari",
    city: "Bucharest",
    type: "Community Health",
    isRomaFriendly: true,
    isFree: true,
    hasInterpreter: true,
    distance: "3.1 km",
  },
  {
    id: "p3",
    name: "Spitalul Județean Ilfov",
    city: "Ilfov",
    type: "Hospital",
    isRomaFriendly: true,
    isFree: false,
    hasInterpreter: false,
    distance: "12 km",
  }
];

export default async function ProvidersPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "providers" });

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <main id="main-content" className="flex-1 pb-8">
        <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
          <div className="mb-8 text-center animate-fade-in-up">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl gradient-brand grain-overlay shadow-brand">
              <Map className="lucide h-8 w-8 text-white" strokeWidth={1.85} />
            </div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)] md:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base max-w-md mx-auto">
              {t("subtitle")}
            </p>
          </div>

          <div className="mb-6 relative animate-fade-in-up delay-100">
            <input 
              type="text" 
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface)] px-5 py-4 pl-12 text-sm text-[var(--color-text-primary)] shadow-1 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
            />
            <MapPin className="lucide h-5 w-5 absolute left-4 top-4 text-[var(--color-text-muted)]" strokeWidth={1.85} />
          </div>

          <div className="space-y-4 animate-fade-in-up delay-200">
            {PROVIDERS.map((provider) => (
              <Card key={provider.id} variant="interactive" className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="font-display text-lg font-extrabold text-[var(--color-text-primary)]">
                      {provider.name}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mt-1">
                      <Building2 className="lucide h-4 w-4" strokeWidth={1.85} />
                      {provider.type} • {provider.city}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[var(--color-text-muted)]">{provider.distance}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {provider.isRomaFriendly && (
                    <Badge variant="success">
                      <ShieldCheck className="lucide h-3 w-3" strokeWidth={1.85} />
                      {t("verified")}
                    </Badge>
                  )}
                  {provider.isFree && (
                    <Badge variant="info">
                      <HeartPulse className="lucide h-3 w-3" strokeWidth={1.85} />
                      {t("freeClinic")}
                    </Badge>
                  )}
                  {provider.hasInterpreter && (
                    <Badge variant="brand">
                      <CheckCircle2 className="lucide h-3 w-3" strokeWidth={1.85} />
                      {t("interpreter")}
                    </Badge>
                  )}
                </div>

                <button className="w-full py-2.5 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] text-sm font-bold text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors flex items-center justify-center gap-2">
                  <MapPin className="lucide h-4 w-4" strokeWidth={1.85} />
                  {t("getDirections")}
                </button>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
