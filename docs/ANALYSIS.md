# Platform Analysis — Redi Health / Zuvo

> A full-stack review of what this platform is, how its business process works today,
> and where it must evolve to be adopted by the Romanian and Italian governments as
> infrastructure for vulnerable communities' access to health services.
>
> Companion document: [`PITCH.md`](./PITCH.md) — the government-facing narrative.

---

## 1. What the platform is

Redi Health (product name "Zuvo", configurable via `NEXT_PUBLIC_APP_NAME`) is a
mobile-first, offline-capable **health companion and mediation platform** for
communities that mainstream health systems reach last: rural villages, segregated
neighbourhoods, and Roma communities across Romania and the Balkans.

It is **not** a learning management system and **not** a telemedicine product. Its
core thesis: the biggest barrier to care for vulnerable groups is not distance to a
hospital — it is *navigation* (not knowing what you're entitled to, what to bring,
what to say), *trust* (fear of discrimination, fear of registration), and
*misinformation* (viral health lies on WhatsApp/TikTok/Facebook).

### 1.1 The three user surfaces

| Surface | Who | Key routes | Auth model |
|---|---|---|---|
| **Companion** | Families, patients, students | `/chat`, `/scan`, `/symptoms`, `/navigate`, `/explain`, `/family`, `/vaccines`, `/rights`, `/students`, `/quiz`, `/glossary`, `/stories`, `/track` | Anonymous-first (local storage + optional Supabase anonymous session) |
| **Mediator workspace** | Community health mediators (AMC / mediator sanitar), social workers, school counsellors | `/mediator` | Durable client-generated workspace UUID, optionally linked to a Supabase account |
| **Operator / ministry** | Programme administrators, ministries, NGO partners | `/admin`, `/impact`, `/methodology` | Supabase auth with `role` = admin / content_manager |

### 1.2 Companion features (beneficiary side)

- **AI Health Advisor** (`/chat`, `src/components/ChatAdvisor.tsx`) — WhatsApp-style
  chat, voice in/out (Web Speech API + Deepgram in `src/lib/ai/deepgram.ts`),
  streaming answers, written in the persona of an experienced Roma health mediator
  (`src/lib/ai/system-prompt.ts`). Critical design choice: voice-first for
  low-literacy users.
- **Misinformation Scanner** (`/scan`, `MisinfoScanner.tsx`) — paste a claim or link
  → VERIFIED / MISLEADING / FALSE verdict with plain-language explanation and a
  shareable "truth card".
- **Symptom triage** (`/symptoms`, `BodyMap.tsx`, `/api/symptom-check`) — interactive
  body map, traffic-light triage (green/amber/red). **Deterministic red-flag
  detection runs before any AI call** (`src/lib/health/red-flags.ts`) and routes
  emergencies straight to 112. Never diagnoses.
- **Healthcare Navigator** (`/navigate`, `HealthcareNavigator.tsx`) — guided flow:
  issue type → insurance status → country → step-by-step access guide + a printable
  **doctor visit card** in the national language (`/api/visit-card`).
- **Prescription Explainer** (`/explain`) — photograph or type a prescription, get
  dosing, warnings, and plain-language explanation.
- **Family Hub** (`/family`) — multiple local profiles per device, vaccination
  tracker, health logs, no registration required.
- **Rights education** (`/rights`, `src/data/rights.ts`) — eight universal patient
  rights and scripted responses to discrimination scenarios ("the hospital refuses
  to treat you", "staff are dismissive because of your ethnicity").
- **Student Health Academy** (`/students`) — gamified, staged health-literacy
  curriculum for high-school audiences, with quizzes, certificates, and a "field
  lab".
- **SOS** (`SosButton.tsx`) — persistent emergency overlay: 112, country hotlines,
  first-aid cards, offline-cached.
- **15 languages** including Romani (`rom`), with Romanian as the default and
  fallback locale (`src/i18n/routing.ts`, `src/i18n/request.ts`).

### 1.3 Mediator workspace (the institutional asset)

Defined in `src/lib/mediator/` and **already aligned with Romanian state
frameworks** — this is the platform's most strategically valuable property:

- **Case management** with POIDS target-group vulnerability tags (`child`,
  `pregnant`, `minVeniturGarantat`, `noInsurance`, `noDocuments`,
  `domesticViolence`, …) and health facilitation flags that map 1:1 to POIDS
  indicators (`gpEnrollment`, `insuranceEnrollment`, `vaccinationFacilitated`,
  `prenatalFacilitated`, `screeningReferral`, `tbCommunicableScreening`,
  `chronicMonitoring`).
- **Visit and session logging** with themes matching Ministry of Health
  health-promotion priorities.
- **KPI computation** (`indicators.ts`) and a **print-to-PDF activity report**
  (`report.ts`) for UJSS / ANPIS reporting.
- **ECI training curriculum** (`src/data/mediator-training.ts`) pinned to Romanian
  legal sources (OUG 18/2017, Normele AMC 2019, POIDS, SCI 2000).
- **All 41 county UJSS contact slots** (`src/data/romania-eci-contacts.ts`).
- **Offline-resilient sync**: the workspace is a versioned JSON blob keyed by a
  durable client UUID (`mediator_workspaces` table), merged additively
  (`merge-workspace.ts`) so old devices never break on schema evolution.

### 1.4 Technical architecture

- **Next.js 16** App Router, `next-intl` for i18n, Tailwind v4 token-driven design
  system (`src/app/globals.css`), Framer Motion, Lucide.
- **Capacitor 8** wrappers for iOS/Android; PWA manifest + offline page + service
  worker.
- **Postgres** (Supabase or Neon) via Drizzle (`src/db/schema.ts`), RLS-enforced;
  16 tables spanning users, health logs, progress, achievements, challenges,
  providers, communities, mediator entities, notifications, platform config.
- **AI**: OpenAI through a provider abstraction (`src/lib/ai/provider.ts`), with
  PII scrubbing before egress, Langfuse tracing, deterministic safety pre-checks.
- **Observability/compliance**: Sentry, PostHog (DNT-honouring), audit log table,
  GDPR export (`/api/me/export`) and delete (`/api/me/delete`) endpoints, documented
  retention policy (`docs/PRIVACY.md`), EU-resident processors.

---

## 2. Business process review

### 2.1 The operating funnel as built

```
┌────────────────────────────────────────────────────────────┐
│ LAYER 1 — Self-service (anonymous)                         │
│  Family uses chat / scanner / navigator / family hub       │
│  Trust currency: no registration, local data, own language │
└──────────────────────────┬─────────────────────────────────┘
                           │ escalation (call mediator, visit card)
┌──────────────────────────▼─────────────────────────────────┐
│ LAYER 2 — Mediated case work                               │
│  Mediator opens case → tags vulnerabilities → logs visits  │
│  → records health facilitations → runs info sessions       │
└──────────────────────────┬─────────────────────────────────┘
                           │ aggregation (indicators.ts)
┌──────────────────────────▼─────────────────────────────────┐
│ LAYER 3 — Institutional reporting                          │
│  KPI report (print-to-PDF) → UJSS / ANPIS / Min. Sănătății │
│  POIDS / FSE+ indicator compliance                         │
└────────────────────────────────────────────────────────────┘
```

### 2.2 What works

1. **Privacy asymmetry matches reality.** Beneficiaries stay anonymous; only the
   mediator (a trusted community figure) holds named case data. Vulnerable
   populations will not register with a government app — this design accepts that
   instead of fighting it.
2. **The indicator schema is the moat.** `src/lib/mediator/types.ts` literally
   encodes what Romania's ministries require mediators to report. No competitor
   tooling does this; mediators currently report on paper or ad-hoc spreadsheets.
3. **Safety architecture is procurement-grade in design**: deterministic red-flag
   triage before AI, PII scrubbing, prompt-injection guards, clinical content
   review process (`docs/CONTENT_REVIEW.md`), runbook with GDPR breach clock
   (`docs/RUNBOOK.md`).
4. **Offline and low-literacy first** — voice everywhere, emoji-anchored topics,
   additive sync, cached emergency data. This matches actual field conditions.

### 2.3 Where the process breaks (gap analysis)

| # | Gap | Evidence | Consequence |
|---|---|---|---|
| 1 | **Reporting is one-way and manual** | `report.ts` renders print-only HTML | Ministries cannot aggregate across mediators; no machine-readable AMCMSR/POIDS export |
| 2 | **Referral loop is open** | No mediator→GP/UJSS handoff entity in schema | Platform informs access but cannot prove *outcomes* (enrollments completed, codes issued) |
| 3 | **Provider directory unpopulated** | `providers` table exists with `isRomaFriendly`, `hasInterpreter`, `isFreeClinic` flags but no seeded data | "Find a clinic" is hollow; this is exactly the data a government partner should supply |
| 4 | **Italy absent** | No `it` locale; Italy missing from `regions.ts` and the Navigator country list | No path to the second-largest concentration of the target population |
| 5 | **Single-tenant config** | One `platform_config` row, one indicator schema | Cannot run two ministries with different branding, indicators, languages |
| 6 | **No procurement artifacts** | No DPIA, EN 301 549 audit, AI Act positioning, MDR boundary statement | Cannot pass a public tender's compliance gate |
| 7 | **County contacts unverified** | `romania-eci-contacts.ts` has empty phone/email for most counties | Mediator "call UJSS" loop depends on data only the government can confirm |
| 8 | **Impact stats are illustrative** | Landing stats hardcoded ("45 mediators", "12.4k myths") | Fine for a demo; a pitch needs the live `/impact` dashboard wired to real telemetry |

### 2.4 Funding / revenue model as implied

Today the model is donor-shaped (Council of Europe / ministry pitch in
`REDESIGN.md`). There is no billing, no tenancy, no SLA layer. The realistic
government model is **co-funded pilot → per-ministry licence + operations
contract**, with EU instruments carrying the pilot cost (both countries already
have obligated budget lines for exactly this population — see `PITCH.md` §5).

---

## 3. Why Romania + Italy is the right two-government play

1. **Romania is already encoded.** The mediator layer speaks POIDS / SCI 2000 /
   OUG 18/2017 natively. Romania has ~1.85–2.5M Roma citizens (`src/data/regions.ts`)
   and a state-recognised *mediator sanitar* profession with reporting obligations
   this platform automates.
2. **Italy hosts the same families.** Italy's Romanian community is the largest
   foreign community in the country (~1M people), including substantial
   Romanian-Roma populations in informal settlements around Rome, Milan, Naples and
   Turin. Italy has a parallel profession (*mediatore culturale / sanitario*), a
   national Roma, Sinti and Caminanti strategy coordinated by UNAR, and a unique
   legal instrument — **STP/ENI codes** — granting undocumented persons and
   non-registered EU citizens free essential care. Almost nobody in the target
   population knows how to obtain these codes; the Healthcare Navigator is already
   shaped to teach exactly this kind of procedure.
3. **Cross-border continuity is the differentiator.** A family moving between
   Bistrița-Năsăud and Lazio currently falls out of both systems. One companion that
   travels with the family — and reports to both ministries — is a story neither
   government can tell alone, and it unlocks EU-level funding (Interreg, EU4Health,
   AMIF) that national tools cannot access.

---

## 4. Redesign rationale (implemented in this revision)

### 4.1 From SaaS indigo to healthcare teal

The previous brand anchor was cobalt indigo (`#4F46E5`) — the default color of
venture SaaS (Linear, Stripe, dozens of admin templates). For a platform pitched to
health ministries and used by communities with justified institutional distrust, the
identity now anchors on **Adriatic teal**:

| Token | Old (Cobalt) | New (Adriatic) |
|---|---|---|
| `--color-brand-600` (primary) | `#4F46E5` | `#0E8074` |
| `--color-brand-500` | `#6366F1` | `#189A8C` |
| `--color-brand-700` | `#4338CA` | `#0D685F` |
| `--color-brand-50` | `#EEF2FF` | `#EFFAF7` |
| Canvas (light) | `#F4F6FB` (cool blue) | `#F3F8F6` (soft mint-neutral) |
| Canvas (dark) | `#0A0F1F` (navy) | `#0A1311` (teal-ink) |

Why teal:

- **Semantics**: teal/green is the global visual language of healthcare and public
  health (pharmacies, clinics, WHO material) — it reads "care", not "startup".
- **Internal harmony**: the design system already carried sage, cream, and ember
  layers that clashed with indigo; teal makes sage/cream feel native, and ember
  (amber) becomes a true complementary accent.
- **Emergency contrast**: crimson SOS elements pop harder against teal than against
  indigo (no blue-purple/red tension).
- **Accessibility**: white on `#0E8074` ≈ 4.9:1 contrast (WCAG AA for normal text);
  `brand-700` on white ≈ 6.9:1 for text accents.

The swap was executed at the token layer (`globals.css`), so every surface that
consumed `--color-brand-*` / `--color-accent*` rebranded automatically; ~20 files
with hardcoded indigo (icons, manifest, splash screens, status bar, error pages,
component-level Tailwind classes) were swept manually. Topic-identity accents
(purple for procedures/rights, blue for nutrition) were intentionally preserved —
they are content semantics, not brand.

### 4.2 Pitch-ready landing

The landing page now closes with a **Government deployment** section: Romania
(status: *aligned today*) and Italy (status: *pilot blueprint*) country cards, the
cross-border "one family, two systems" narrative, EU funding-instrument chips
(POIDS/FSE+, EU4Health, PNRR M6, AMIF, Interreg), and a pilot-briefing CTA. Strings
are translated in the four fully-localised locales (en, ro, sq, rom); the remaining
locales fall back to Romanian per the existing i18n merge strategy.

---

## 5. Prioritised roadmap to government adoption

| Phase | Scope | Key work |
|---|---|---|
| **1. Italy country pack** | Make Italy a first-class deployment | `it` locale; Italy in `regions.ts` + Navigator; **STP/ENI guided flow**; Italian region/ASL contact data mirroring `romania-eci-contacts.ts` |
| **2. Country-pack abstraction** | Multi-tenant institutional layer | Per-country indicator schema (generalise POIDS types); per-tenant `platform_config`; structured CSV/XLSX export matching official templates; eventually a reporting API |
| **3. Closed referral loop** | Prove outcomes, not contacts | Referral entity with status (`referred → enrolled → completed`); government-verified provider directory maintained via the admin panel; outcome KPIs per county/ASL |
| **4. Procurement readiness** | Pass the tender gate | DPIA publication; EN 301 549 accessibility audit; EU AI Act positioning (triage = human-overseen navigation aid, not autonomous medical decision); explicit MDR non-device boundary statement; per-tenant EU data residency; SPID/CIE (IT) and ROeID (RO) SSO for mediators/admins only |
| **5. Pilot operations** | 2 RO counties + 1–2 IT regions | Live `/impact` telemetry per tenant; mediator onboarding kits; clinical review board per country |

The beneficiary anonymity model must survive every phase — it is the trust
foundation the institutional value sits on.
