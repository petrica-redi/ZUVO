<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

Redi Health is a **single Next.js 16 monolith** (npm, Node 22 per `.nvmrc`). Only the web app on **port 3000** is required for local dev and Playwright E2E; Postgres, Supabase, and AI keys are optional for most UI flows.

### Environment file

Copy `.env.example` to `.env.local` if missing. Minimal local dev (matches CI):

```bash
SASTIPE_FORCE_ENV=preview
NEXT_PUBLIC_APP_NAME="Redi Health"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_DEFAULT_LOCALE="en"
NEXT_PUBLIC_SUPPORTED_LOCALES="en,sq,rom,ro,hu,sk,cs,bg,sr,hr,bs,mk,sl,el,tr"
DATABASE_URL="postgres://ci:ci@localhost/ci"
```

Without this file, `npm run dev` still starts but build/E2E env checks may fail. `/api/health` reports `degraded` when the database is unreachable — expected with the dummy `DATABASE_URL`.

### Commands (see `package.json` and `.github/workflows/ci.yml`)

| Task | Command |
|------|---------|
| Dev server | `npm run dev` → http://localhost:3000 |
| Typecheck | `npm run typecheck` |
| Lint | `npm run lint` |
| Unit tests | `npm run test` |
| Production build | `SASTIPE_FORCE_ENV=preview npm run build` |
| E2E | `npx playwright install --with-deps chromium` (once), then `npm run test:e2e` |

Playwright reuses an existing dev server when one is already listening on port 3000 (`reuseExistingServer: !isCI` in `playwright.config.ts`).

### Gotchas

- **`prebuild` env gate**: set `SASTIPE_FORCE_ENV=preview` (or `ci`) when building without real secrets.
- **Lint**: as of setup, `eslint` may fail on `src/components/LanguagePicker.tsx` (`react-hooks/immutability` on `document.cookie`). Typecheck, unit tests, build, and E2E still pass.
- **No Docker/devcontainer** in this repo; no local Postgres container is wired up.
- **AI / auth / sync** need real `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`, Supabase vars, and a real `DATABASE_URL`. Emergency red-flag paths (`/api/consult`, `/api/symptom-check`) work without AI keys.
