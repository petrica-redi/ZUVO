# Sastipe

A Next.js app for health literacy, community navigation, and AI-assisted (non-clinical) guidance for Roma communities across Europe. It is not a medical device.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Required for | Description |
|----------|--------------|-------------|
| `OPENAI_API_KEY` | AI chat, scan, consult, etc. | OpenAI (or compatible) API key |
| `OPENAI_BASE_URL` | Optional | Default `https://api.openai.com/v1` (use a proxy or Azure-compatible base if needed) |
| `OPENAI_MODEL` | Optional | Default `gpt-4o` |
| `DATABASE_URL` | Progress, health log, mediator visits | Neon / Postgres connection string (Drizzle) |
| `NEXT_PUBLIC_APP_URL` | Canonical URLs, sitemap | Production URL, e.g. `https://app.example.org` |
| `NEXT_PUBLIC_APP_NAME` | Optional | Display name (default `Sastipe`) |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Optional | Default `en` |
| `NEXT_PUBLIC_SUPPORTED_LOCALES` | Optional | Comma list; defaults to all locales in `src/i18n/routing.ts` |
| `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase, audit log | Supabase project |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Admin client (rare) |
| `LANGFUSE_*` | Optional | Tracing for AI calls (when set) |
| Sentry, Resend, Trigger.dev | Optional | As wired in `src/lib/env.ts` |

Anonymous users get an `HttpOnly` `sastipe_anon_id` cookie (see `src/middleware.ts`); server routes do not trust a client-supplied `x-anonymous-id` for identity.

**Translations:** The Albanian file `messages/sq.json` is **merged** on top of `messages/en.json` (see `src/i18n/request.ts`) so the demo can ship full Albanian for key namespaces without duplicating the entire app copy.

**Ministry demo:** In the app, open **More → Ministry briefing (pilot overview)** (`/moh-brief`, e.g. `/sq/moh-brief` in Albanian) for a short policy-oriented summary. Print or show on a second screen for the meeting.

## Scripts

- `npm run build` — production build
- `npm run typecheck` — TypeScript
- `npm test` — Vitest
- `npm run test:e2e` — Playwright
- `npm run db:generate` / `db:push` — Drizzle (requires `DATABASE_URL`)

See `package.json` for the full list.
