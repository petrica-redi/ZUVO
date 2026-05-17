#!/usr/bin/env node
/**
 * Generate Capacitor's required webDir for hybrid native builds.
 *
 * This Next.js app uses Route Handlers (`/api/*`), so `output: "export"` is
 * not a valid representation of the shipped product. Capacitor hybrid mode
 * loads the live app from `capacitor.config.ts#server.url`; this script creates
 * a tiny local fallback shell in `out/` so `cap sync` has assets to package.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const serverUrl =
  process.env.CAP_SERVER_URL?.trim() ||
  "https://redi.healthcare";

const outDir = resolve(process.cwd(), "out");
await mkdir(outDir, { recursive: true });

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
    <meta name="theme-color" content="#4F46E5" />
    <title>Redi Health</title>
    <style>
      :root { color-scheme: light dark; }
      * { box-sizing: border-box; }
      html, body { height: 100%; margin: 0; }
      body {
        display: grid;
        place-items: center;
        min-height: 100dvh;
        padding: 24px;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background:
          radial-gradient(circle at 80% 0%, rgba(251, 191, 36, 0.18), transparent 32rem),
          radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.18), transparent 32rem),
          #F4F6FB;
        color: #0F172A;
      }
      main {
        width: min(100%, 420px);
        padding: 28px;
        border: 1px solid rgba(15, 23, 42, 0.08);
        border-radius: 28px;
        background: rgba(255, 255, 255, 0.78);
        box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
        text-align: center;
        backdrop-filter: blur(24px) saturate(180%);
      }
      .mark {
        display: inline-grid;
        place-items: center;
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
        border-radius: 18px;
        background: linear-gradient(135deg, #4F46E5, #6D28D9 55%, #312E81);
        color: white;
        box-shadow: 0 8px 24px rgba(79, 70, 229, 0.24);
      }
      h1 { margin: 0 0 8px; font-size: 24px; letter-spacing: -0.03em; }
      p { margin: 0 0 20px; color: #475569; line-height: 1.55; }
      a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 48px;
        width: 100%;
        border-radius: 16px;
        background: linear-gradient(135deg, #4F46E5, #6D28D9);
        color: white;
        font-weight: 800;
        text-decoration: none;
      }
      @media (prefers-color-scheme: dark) {
        body { background: #0A0F1F; color: #F8FAFC; }
        main { background: rgba(15, 23, 42, 0.76); border-color: rgba(255,255,255,0.08); }
        p { color: #CBD5E1; }
      }
    </style>
  </head>
  <body>
    <main>
      <div class="mark" aria-hidden="true">
        <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
          <path d="M9 27H31" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
          <path d="M11.5 27A8.5 8.5 0 0 1 28.5 27" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/>
          <circle cx="20" cy="22.5" r="3" fill="#FBBF24"/>
          <path d="M20 14V11.5" stroke="#FBBF24" stroke-width="2.2" stroke-linecap="round"/>
        </svg>
      </div>
      <h1>Redi Health</h1>
      <p>The native app loads the live Redi Health platform. If it does not open automatically, use the button below.</p>
      <a href="${serverUrl}">Open Redi Health</a>
    </main>
    <script>
      setTimeout(function () {
        try { window.location.replace(${JSON.stringify(serverUrl)}); } catch (_) {}
      }, 300);
    </script>
  </body>
</html>
`;

await writeFile(resolve(outDir, "index.html"), html, "utf8");
await writeFile(
  resolve(outDir, "README.txt"),
  `Capacitor fallback shell generated for ${serverUrl}\n`,
  "utf8",
);

console.log(`[mobile] generated Capacitor fallback shell in ${outDir}`);
console.log(`[mobile] native app target: ${serverUrl}`);
