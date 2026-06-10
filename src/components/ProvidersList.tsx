"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  HeartPulse,
  Map,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { Card, Badge } from "@/components/ui";

type ProviderRow = {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string | null;
  latitude: number;
  longitude: number;
  region: string | null;
  isRomaFriendly: boolean;
  isFreeClinic: boolean;
  hasInterpreter: boolean;
  website: string | null;
};

export function ProvidersList({
  title,
  subtitle,
  searchPlaceholder,
  verifiedLabel,
  freeClinicLabel,
  interpreterLabel,
  directionsLabel,
  providers,
}: {
  locale: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  verifiedLabel: string;
  freeClinicLabel: string;
  interpreterLabel: string;
  directionsLabel: string;
  providers: ProviderRow[];
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return providers;
    return providers.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        (p.region ?? "").toLowerCase().includes(q),
    );
  }, [providers, query]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 text-center animate-fade-in-up">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl gradient-brand grain-overlay shadow-brand">
          <Map className="lucide h-8 w-8 text-white" strokeWidth={1.85} />
        </div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)] md:text-4xl">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base">
          {subtitle}
        </p>
      </div>

      <div className="relative mb-6 animate-fade-in-up delay-100">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="w-full rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface)] px-5 py-4 pl-12 text-sm text-[var(--color-text-primary)] shadow-1 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
        />
        <MapPin
          className="lucide absolute left-4 top-4 h-5 w-5 text-[var(--color-text-muted)]"
          strokeWidth={1.85}
        />
      </div>

      <div className="space-y-4 animate-fade-in-up delay-200">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-[var(--color-text-muted)]">
            No clinics match your search.
          </p>
        ) : (
          filtered.map((provider) => (
            <Card key={provider.id} variant="interactive" className="p-5">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h2 className="font-display text-lg font-extrabold text-[var(--color-text-primary)]">
                    {provider.name}
                  </h2>
                  <div className="mt-1 flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <Building2 className="lucide h-4 w-4" strokeWidth={1.85} />
                    {provider.type} • {provider.region ?? "—"}
                  </div>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">{provider.address}</p>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {provider.isRomaFriendly && (
                  <Badge variant="success">
                    <ShieldCheck className="lucide h-3 w-3" strokeWidth={1.85} />
                    {verifiedLabel}
                  </Badge>
                )}
                {provider.isFreeClinic && (
                  <Badge variant="info">
                    <HeartPulse className="lucide h-3 w-3" strokeWidth={1.85} />
                    {freeClinicLabel}
                  </Badge>
                )}
                {provider.hasInterpreter && (
                  <Badge variant="brand">
                    <CheckCircle2 className="lucide h-3 w-3" strokeWidth={1.85} />
                    {interpreterLabel}
                  </Badge>
                )}
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${provider.latitude},${provider.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] py-2.5 text-sm font-bold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface-hover)]"
              >
                <MapPin className="lucide h-4 w-4" strokeWidth={1.85} />
                {directionsLabel}
              </a>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
