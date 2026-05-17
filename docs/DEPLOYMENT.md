# Deployment guide

Redi Health is a Next.js 16 application with a Postgres database, Supabase auth, and several optional integrations. This guide covers a clean Vercel deployment to **`https://redi.healthcare`**, but the same env contract works for any Node 22 host (Railway, Fly.io, Render, self-hosted Docker).

## TL;DR launch checklist

1. Create the four core accounts: Vercel, Supabase, Neon (or use Supabase Postgres), Sentry.
2. Provision a database (`DATABASE_URL`).
3. Run the SQL in `supabase/migrations/` in order against the database.
4. Create the Vercel project and paste env vars from the section below.
5. Set up Upstash Redis for rate limiting (recommended for any multi-instance deploy).
6. Set up Resend for email and PostHog for analytics (optional).
7. Push to `main`. CI runs typecheck → lint → unit → build → E2E.

## 1. Database

### Option A: Supabase (recommended for an integrated stack)

```bash
# 1. Create a Supabase project at https://supabase.com
# 2. Get connection strings from Project Settings → Database
# 3. Apply migrations
psql "$DATABASE_URL" -f supabase/migrations/20260319000000_initial_schema.sql
# (and any later migration files in order)
```

### Option B: Neon

Neon's serverless driver is already wired in `src/db/client.ts`. Just set `DATABASE_URL` to a Neon Postgres connection string with `?sslmode=require`.

### Row-level security

Every user-data table must have RLS policies. The initial migration ships with policies for `users`, `health_logs`, `progress`, and `audit_log`. **Verify** with:

```sql
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

Every public table should have `rowsecurity = true`. If `false`, that table is reachable without auth — fix immediately.

## 2. Vercel project setup

```bash
# Install once
npm i -g vercel
vercel link
```

Set environment variables in `vercel env add`. Use `Production`, `Preview`, and `Development` scopes appropriately. **All variables required for production are listed in [`.env.example`](../.env.example).**

The build will refuse to start if production-required variables are missing — see `scripts/check-env.mjs`.

## 3. Auth

Supabase auth is configured in `src/lib/supabase/`. Two flows are supported:

- **Anonymous**: a Supabase anonymous session is created on first visit. Cookies persist across sessions.
- **Magic link**: email-based, no password.

Cookie-based sessions are validated server-side. Client `x-anonymous-id` headers are still accepted for backward compatibility but treated as low-trust.

## 4. Rate limiting

The codebase ships with two rate limiters:

- **In-memory** ([`src/lib/api/rate-limit.ts`](../src/lib/api/rate-limit.ts)) — fine for local dev and single-instance preview. **Not safe** in production: every cold start gets a fresh map.
- **Upstash Redis** — set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` and the limiter automatically upgrades to durable, distributed sliding-window limits.

Limits per endpoint are documented in each route file's header comment.

## 5. AI cost protection

Three controls run on every AI call:

1. Per-IP / per-anonymous-id rate limit (above).
2. Per-user daily cap from `AI_USER_DAILY_CAP` (default 40).
3. Org-wide daily budget from `AI_DAILY_BUDGET_EUR` (default 50).

When either daily counter is exceeded, the API returns `503 service_paused` with a friendly message and an `X-Redi-Budget` header. This is intentional — it caps cost in the worst case (an LLM-cost DoS).

## 6. Voice (Deepgram)

Multilingual STT for the chat mic comes from Deepgram. Set `DEEPGRAM_API_KEY` to enable; when missing, the mic transparently falls back to the browser's WebSpeech engine. See [`VOICE.md`](./VOICE.md) for setup, rate limits, and cost notes.

## 7. Observability

| Tool | Purpose | Variables |
|------|---------|-----------|
| Sentry | Error tracking + source maps | `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` |
| Langfuse | AI request tracing | `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`, `LANGFUSE_BASE_URL` |
| PostHog | Product analytics | `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` |
| Deepgram | Speech-to-text (multilingual mic) | `DEEPGRAM_API_KEY` |

Health endpoint at `GET /api/health` returns DB, Redis, and AI-config status. Wire to your uptime monitor.

## 8. CI/CD

GitHub Actions in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) runs on every PR and push to `main`:

```
typecheck → lint → unit tests → build → E2E (Playwright)
```

Vercel auto-deploys preview environments per PR and promotes `main` to production. Each preview gets a unique URL with the same env contract.

## 9. Domain & DNS — `redi.healthcare`

Canonical production URL is **`https://redi.healthcare`** (apex). The marketing footer, sitemap, mailto links, Capacitor `server.url`, robots.txt and CI all reference this host.

### Vercel side

1. In **Vercel → Project → Settings → Domains** add both:
   - `redi.healthcare`  (production, primary)
   - `www.redi.healthcare` (will 308 to apex automatically)
2. Set `NEXT_PUBLIC_APP_URL=https://redi.healthcare` in **Production** env (and any staging URL in **Preview**). No trailing slash.
3. Set `CAP_SERVER_URL=https://redi.healthcare` if you build mobile shells from CI.

### DNS records at the registrar

| Host                  | Type  | Value                  |
|-----------------------|-------|------------------------|
| `redi.healthcare`     | A     | `76.76.21.21`          |
| `www.redi.healthcare` | CNAME | `cname.vercel-dns.com` |

(If the Vercel UI prints different values for your project, use those. Vercel auto-issues TLS once DNS resolves.)

### Verify
```bash
dig +short redi.healthcare
curl -sI https://redi.healthcare | head -1     # expect HTTP/2 200
curl -sI https://www.redi.healthcare | head -1 # expect HTTP/2 308 to apex
```

TLS, HSTS, and CSP headers are configured in `next.config.ts` and the middleware.

## 10. Emergencies

See [`RUNBOOK.md`](./RUNBOOK.md) for incident procedures: AI outage, rate-limit storm, PII exposure, database failure.
