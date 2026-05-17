# Privacy & data handling

This document covers what Redi Health collects, why, and how to honour data-subject rights under GDPR and equivalent regulations.

## Data we store

| Table | What | Why | Retention |
|-------|------|-----|-----------|
| `users` | Account, locale, preferences, XP, streak, last active | Auth, personalisation, gamification | Until account deletion |
| `progress` | Lesson and stage completion | Personal progress tracking | Until account deletion |
| `health_logs` | Mood, water, activity, vitals, vaccination records | Self-tracking, mediator support | 5 years or until deletion |
| `audit_log` | Who did what, when, on which resource | GDPR audit, abuse investigation | 1 year |
| `notifications` | Push and in-app messages | Reminders, alerts | 90 days then archived |
| `mediator_visits` | Field worker logs | Community health support | 5 years |

We **do not** store:
- Raw AI prompts longer than the request lifecycle
- IP addresses past the audit log retention window
- Free-text notes from the Field Lab (these stay on the device)

## Third-party processors

| Processor | Purpose | Data sent | Region |
|-----------|---------|-----------|--------|
| OpenAI | AI consultation, symptom check, fact check | User-typed text (last 8 messages) | US, with EU residency option |
| Supabase | Auth, DB, storage | Account, progress, health logs | EU |
| Neon | Postgres host (alt to Supabase) | Same as Supabase | EU available |
| Sentry | Error tracking | Stack traces, user agent, route | EU available |
| Langfuse | AI request tracing | AI prompts and responses | EU |
| PostHog | Product analytics | Anonymous events | EU |
| Resend | Transactional email | Email address, message content | US, with EU option |
| Upstash | Rate limiting | Hashed identifier + count | Global, region-pinnable |

We **scrub PII patterns** before sending text to OpenAI. See `src/lib/ai/scrub.ts`.

## Data-subject rights

Implemented via in-app `/profile` and the following endpoints:

- `GET /api/me/export` — returns a JSON bundle of every record tied to the user.
- `POST /api/me/delete` — soft-deletes the user, scrubs identifying fields, queues a hard delete after 30 days.

These endpoints are auth-required. Anonymous-only sessions get a device-local export only.

## Consent

- **Cookies**: We use one cookie for auth (`sb-*` from Supabase) and at most one analytics cookie (PostHog, only when `NEXT_PUBLIC_POSTHOG_KEY` is set). No advertising cookies.
- **Analytics opt-out**: Honoured via the user's `Do-Not-Track` header. PostHog calls become no-ops.
- **AI processing notice**: Shown on every AI route's first use, with a link to the OpenAI processing policy.

## Children & minors

The Student Health Academy is positioned for high-school audiences (typically 14+). We:

- Do not collect age unless the user volunteers it in `health_logs`.
- Refer all sensitive sexual-health and consent topics to local clinics, school nurses, or hotlines via [`src/components/StudentAcademyLessonFooter.tsx`](../src/components/StudentAcademyLessonFooter.tsx) and the lesson-page support card.
- Apply tighter content review to STI, consent, and emergency modules — see [`docs/CONTENT_REVIEW.md`](./CONTENT_REVIEW.md).

## Data Protection Officer

- Email: dpo@redi.healthcare
- Mail address: in the operator-specific deployment notice
- 30-day SLA for data-subject requests

## Breach response

See [`RUNBOOK.md`](./RUNBOOK.md), section "PII or health-data leak". The 72-hour GDPR notification clock starts on awareness.
