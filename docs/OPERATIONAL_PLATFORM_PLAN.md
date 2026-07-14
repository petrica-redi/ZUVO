# REDI Healthcare — Operational Platform Implementation Plan

## 1. Architecture audit (discovered)

| Layer | Technology | Key paths |
|-------|------------|-----------|
| Frontend | Next.js 16 App Router, React 19, Tailwind 4 | `src/app/[locale]/`, `src/components/` |
| Backend | Next.js Route Handlers (serverless) | `src/app/api/` |
| Database | PostgreSQL (Supabase/Neon) + Drizzle ORM | `src/db/schema.ts`, `supabase/migrations/` |
| Auth | Supabase Auth + anonymous sessions; separate admin cookie | `src/lib/auth/`, `src/lib/admin/` |
| Mediator data | Offline-first `localStorage` workspace + optional cloud sync | `src/lib/mediator/workspace-client.ts`, `src/app/api/mediator/workspace/` |
| Impact | Server stats + illustrative demo fallback | `src/lib/impact/stats.ts`, `src/app/[locale]/impact/` |
| Providers | Seeded directory, basic search | `src/data/providers-seed.ts`, `src/app/[locale]/providers/` |
| AI / triage | Anthropic/OpenAI with deterministic red-flag bypass | `src/lib/ai/`, `src/lib/health/red-flags.ts` |
| i18n | next-intl, 16 locales, default `ro` | `src/i18n/`, `messages/` |
| Notifications | Schema only — delivery not wired | `src/db/schema.ts` (`notifications`), `src/app/api/push/` (placeholder) |
| Audit | `audit_log` table + `src/lib/audit.ts` | Limited call sites today |
| Tests | Vitest (157 tests), Playwright e2e | `src/**/*.test.ts`, `e2e/` |
| Deploy | Vercel + Capacitor hybrid | `vercel.json`, `scripts/deploy-prod.sh` |

### Current roles

- **DB roles** (`users.role`): `user`, `mediator`, `admin`, `content_manager` — lightly enforced.
- **Demo personas** (client-side): `community`, `mediator`, `manager`, `doctor`, `admin` — route guards only.
- **Admin CMS**: cookie session, not linked to Supabase roles.

### Gaps addressed by this plan

1. Mediator cases are simple local records — not a full navigation workflow.
2. No structured barriers, tasks, appointments, or outcomes in DB.
3. Provider directory lacks verification workflow.
4. No intake / callback routing.
5. Ministry dashboard uses illustrative county data in places.
6. Notifications and file storage are scaffolds only.

---

## 2. Product principles (non-negotiable)

- Navigation and access facilitation — **not** diagnosis, prescribing, or autonomous clinical decisions.
- Licensed professionals remain responsible for treatment.
- Least-privilege, role-based access; ministry sees aggregates only.
- Roma ethnicity never required for support.
- Mobile-first, low-bandwidth, offline-capable mediator tools.
- Audit trail on sensitive actions.
- Emergency signs → 112 (existing `red-flags.ts` preserved).
- AI text clearly separated from professional medical advice.

---

## 3. Implementation phases

### Phase 1 — Operational core (this branch)

- [x] Implementation plan document
- [x] DB migration: cases, tasks, barriers, categories, consents, intake, geography, organisations
- [x] Drizzle schema + domain types
- [x] Permission helpers + extended audit actions
- [x] API routes: `/api/operations/cases`, `/api/operations/tasks`, `/api/operations/intake`
- [ ] Extended mediator workspace types (v2 additive fields) — operational data uses separate local store + API
- [x] Mediator UI: operational case form, tasks tab, improved overview
- [x] Public intake: `/help` — request mediator assistance
- [x] Tests: permissions, barrier suggestions, case IDs
- [x] i18n: `en`, `ro` for new strings
- [x] Mediator workflow guide

### Phase 2 — Provider access

- Extend `providers` with verification states and rich fields
- Provider search matched to case category / language / municipality
- Referral + appointment entities and UI
- Attendance follow-up workflow

### Phase 3 — Human support & notifications

- Callback routing rules by geography + language
- Resend email + in-app notifications (existing Resend client)
- Missed-appointment recovery tasks
- Supervisor escalation queue

### Phase 4 — Outcomes & government reporting

- Structured outcomes linked to cases
- Programme indicators on impact dashboard (live vs illustrative labels)
- Restricted CSV exports with audit log
- Data-quality flags for supervisors

### Phase 5 — Cross-border continuity

- Handover consent + origin/destination team workflow
- Country-specific editable guidance (admin CMS extension)

---

## 4. Permission model (Phase 1)

| Role | Cases | Tasks | Intake | Aggregates |
|------|-------|-------|--------|------------|
| Beneficiary (anonymous) | own intake only | — | create | — |
| Mediator (workspace) | own workspace | own workspace | convert to case | — |
| Supervisor (admin key) | team scope | reassign | view all in org | team reports |
| Ministry viewer | — | — | — | aggregated only |
| System admin | full CMS + config | full | full | full |

Enforcement: server-side in `src/lib/operations/permissions.ts` — never UI-only.

---

## 5. Case lifecycle

`new` → `consent_pending` → `assessment` → `action_required` → `provider_search` → `appointment_requested` → `appointment_confirmed` → `waiting_beneficiary` → `waiting_provider` → `referred` → `follow_up` → `completed` | `closed_incomplete` | `cancelled` | `escalated`

Urgency: `routine`, `priority`, `urgent`, `emergency` (emergency shows 112 warning; does not block emergency guidance).

---

## 6. Environment variables (no new required vars for Phase 1)

Existing: `DATABASE_URL`, `ADMIN_API_KEY`, workspace sync headers.

Optional later: `RESEND_API_KEY`, `TWILIO_*`, WhatsApp webhook secrets.

---

## 7. Known limitations after Phase 1

- Cases sync via workspace ID; full Supabase user ↔ mediator binding still partial.
- Provider verification workflow is Phase 2.
- Appointments and referrals are Phase 2.
- SMS/WhatsApp delivery not wired.
- Cross-border handover is Phase 5.
- Legal/GDPR/EHDS compliance requires institutional review beyond software features.

---

## 8. Test commands

```bash
npm run typecheck
npm test
npm run build
npm run test:e2e   # optional
```
