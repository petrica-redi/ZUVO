# Redi Health

Multilingual, AI-assisted health-literacy platform for rural, underserved, and Roma communities across Europe. It pairs plain-language health education with an AI assistant (backed by human mediators), works offline where possible, and ships as both a web PWA and native iOS/Android shells.

> The user-facing product name is configurable via `NEXT_PUBLIC_APP_NAME` (e.g. "Redi Health" / "Zuvo").

## Features

- **AI health assistant** — streaming chat, symptom triage, prescription explainer, and misinformation scanner, with daily cost caps and PII scrubbing before any text leaves the app.
- **Student Health Academy** — gamified, stage-based curriculum with XP, streaks, quizzes, and certificates.
- **Community health mediators** — dashboard, visit logging, and workspace tooling for field workers.
- **15 locales** — `en, sq, rom (Romani), ro, hu, sk, cs, bg, sr, hr, bs, mk, sl, el, tr`, with voice input/output.
- **Privacy-first** — GDPR export/delete flows, on-device-only storage for guests, and a strict Content Security Policy.
- **PWA + offline** — installable, service-worker cached app shell with an offline fallback page.
- **Native mobile** — iOS/Android via Capacitor.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- [next-intl](https://next-intl.dev) for i18n (locale-prefixed routes under `src/app/[locale]`)
- Tailwind CSS v4
- Drizzle ORM + Postgres (Supabase or Neon)
- OpenAI / Anthropic for AI, Deepgram for speech
- Sentry, PostHog, and Langfuse for observability
- Capacitor for native shells

> ⚠️ This repo pins a specific Next.js version with breaking changes from older releases. Before changing routing, data fetching, or config, read the bundled guides in `node_modules/next/dist/docs/`.

## Getting started

Requires Node.js >= 20 (see `.nvmrc`).

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to the default locale (configurable via `NEXT_PUBLIC_DEFAULT_LOCALE`, defaults to `ro`).

## Environment

All variables are documented in [`.env.example`](./.env.example). `scripts/check-env.mjs` runs on `prebuild` and will refuse a production build when required vars are missing (set `SASTIPE_STRICT_ENV=1` to enforce strictly). The app degrades gracefully in development when AI/DB/analytics keys are absent.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (runs env check first) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | End-to-end + accessibility tests (Playwright) |
| `npm run check:env` | Validate environment variables |
| `npm run db:generate` / `db:migrate` / `db:push` / `db:studio` | Drizzle database tooling |
| `npm run mobile:sync` / `mobile:open:ios` / `mobile:open:android` | Capacitor native shells |

## Testing

- **Unit:** `npm test` (Vitest, jsdom). Co-located `*.test.ts` files, mostly under `src/lib`.
- **E2E + a11y:** `npm run test:e2e` (Playwright). The accessibility suite runs a full axe audit when `A11Y_AUDIT=1` is set.

## Project structure

```
src/
  app/[locale]/   Localized pages (App Router)
  app/api/        Route handlers (chat, symptom-check, GDPR export/delete, …)
  components/     UI and feature components
  lib/            Domain logic, AI helpers, auth, voice, rate limiting
  i18n/           next-intl request config
messages/         Per-locale translation JSON
public/           PWA assets: manifest.json, sw.js, offline.html, icons
drizzle/          SQL migrations + snapshots
e2e/              Playwright specs (smoke, a11y, academy, safety)
docs/             Deployment, privacy, mobile, voice, content-review, runbook
```

## Documentation

- [Deployment](./docs/DEPLOYMENT.md)
- [Privacy & data handling](./docs/PRIVACY.md)
- [Mobile (Capacitor)](./docs/MOBILE.md)
- [Voice](./docs/VOICE.md)
- [Content review](./docs/CONTENT_REVIEW.md)
- [Operations runbook](./docs/RUNBOOK.md)

## License

See [LICENSE](./LICENSE).
