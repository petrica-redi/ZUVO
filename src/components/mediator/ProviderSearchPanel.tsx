"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, Phone, Search, ShieldCheck, Star } from "lucide-react";
import type { NavigationCase } from "@/lib/operations/types";
import type { OperationalProvider } from "@/lib/operations/types";
import { searchProvidersForCase } from "@/lib/operations/operations-client";
import { EmptyState } from "./parts";

function matchBadge(t: ReturnType<typeof useTranslations>, reason: string): string {
  const key = `match_${reason}` as Parameters<typeof t>[0];
  try {
    return t(key);
  } catch {
    return reason;
  }
}

export function ProviderSearchPanel({
  navCase,
  onSelectProvider,
  selectedProviderId,
}: {
  navCase: NavigationCase;
  onSelectProvider: (provider: OperationalProvider) => void;
  selectedProviderId?: string;
}) {
  const t = useTranslations("operations");
  const [providers, setProviders] = useState<OperationalProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const runSearch = useCallback(async () => {
    setLoading(true);
    const results = await searchProvidersForCase(
      navCase.categorySlug,
      navCase.preferredLanguage,
      navCase.municipalityCode,
      navCase.countryCode,
    );
    setProviders(results);
    setSearched(true);
    setLoading(false);
  }, [navCase]);

  useEffect(() => {
    const timer = window.setTimeout(() => void runSearch(), 0);
    return () => window.clearTimeout(timer);
  }, [runSearch]);

  return (
    <div className="rounded-2xl border border-[var(--color-sage-200)] bg-[var(--color-surface)] p-4 shadow-1">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
          {t("providerSearchTitle")}
        </h3>
        <button
          type="button"
          onClick={() => void runSearch()}
          disabled={loading}
          className="flex min-h-[36px] items-center gap-1 rounded-full bg-[var(--color-sage-100)] px-3 py-1.5 text-[11px] font-extrabold text-[var(--color-sage-800)]"
        >
          <Search className="h-3.5 w-3.5" />
          {loading ? t("searching") : t("searchProviders")}
        </button>
      </div>

      <p className="mb-3 text-xs text-[var(--color-text-muted)]">
        {t("providerSearchHint", {
          category: t(`category_${navCase.categorySlug}`),
          language: navCase.preferredLanguage.toUpperCase(),
        })}
      </p>

      {searched && providers.length === 0 ? (
        <EmptyState message={t("noProvidersFound")} />
      ) : (
        <ul className="flex flex-col gap-2">
          {providers.map((p) => {
            const selected = selectedProviderId === p.id;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => onSelectProvider(p)}
                  className={`w-full rounded-xl border p-3 text-left transition-colors ${
                    selected
                      ? "border-[var(--color-sage-600)] bg-[var(--color-sage-50)]"
                      : "border-[var(--color-border-default)] bg-[var(--color-bg-canvas)]"
                  }`}
                >
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <span className="text-sm font-bold text-[var(--color-text-primary)]">
                      {p.name}
                    </span>
                    {p.verificationState === "verified" && (
                      <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-[var(--color-success-bg)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--color-success-text)]">
                        <ShieldCheck className="h-3 w-3" />
                        {t("verification_verified")}
                      </span>
                    )}
                  </div>

                  <p className="mb-1 text-xs text-[var(--color-text-muted)]">
                    {t(`providerType_${p.type}` as Parameters<typeof t>[0])}
                  </p>

                  <div className="mb-2 flex items-start gap-1 text-xs text-[var(--color-text-secondary)]">
                    <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                    {p.address}
                  </div>

                  {p.phone && (
                    <div className="mb-2 flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
                      <Phone className="h-3 w-3" />
                      {p.phone}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {p.isRomaFriendly && (
                      <span className="rounded-full bg-[var(--color-sage-100)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-sage-800)]">
                        {t("romaFriendly")}
                      </span>
                    )}
                    {p.isFreeClinic && (
                      <span className="rounded-full bg-[var(--color-info-bg)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-info-text)]">
                        {t("freeClinic")}
                      </span>
                    )}
                    {p.hasInterpreter && (
                      <span className="rounded-full bg-[var(--color-warning-bg)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-warning-text)]">
                        {t("hasInterpreter")}
                      </span>
                    )}
                    {(p.matchReasons ?? []).slice(0, 3).map((r) => (
                      <span
                        key={r}
                        className="rounded-full bg-[var(--color-sage-50)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-sage-700)]"
                      >
                        {matchBadge(t, r)}
                      </span>
                    ))}
                  </div>

                  {typeof p.matchScore === "number" && p.matchScore > 0 && (
                    <p className="mt-2 flex items-center gap-1 text-[10px] text-[var(--color-text-muted)]">
                      <Star className="h-3 w-3 text-[var(--color-sage-600)]" />
                      {t("matchScore", { score: p.matchScore })}
                    </p>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
