#!/usr/bin/env node
/**
 * Apply supabase/migrations/*.sql in filename order.
 * Uses POSTGRES_URL_NON_POOLING when available (DDL-safe direct connection).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    let value = trimmed.slice(eq + 1);
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.join(repoRoot, ".vercel", ".env.production.local"));
loadEnvFile(path.join(repoRoot, ".env.local"));

const databaseUrl =
  process.env.POSTGRES_URL_NON_POOLING?.trim() ||
  process.env.DATABASE_URL?.trim() ||
  process.env.POSTGRES_URL?.trim();

if (!databaseUrl) {
  console.error(
    "[migrate] No database URL. Run `vercel env pull` after connecting Supabase.",
  );
  process.exit(1);
}

const migrationsDir = path.join(repoRoot, "supabase", "migrations");
const files = fs
  .readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

const sql = postgres(databaseUrl, { max: 1, ssl: "require" });

async function main() {
  await sql`CREATE TABLE IF NOT EXISTS schema_migrations (
    filename text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
  )`;

  const applied = new Set(
    (await sql`SELECT filename FROM schema_migrations`).map((r) => r.filename),
  );

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`[migrate] skip ${file}`);
      continue;
    }
    const body = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    console.log(`[migrate] apply ${file}`);
    await sql.unsafe(body);
    await sql`INSERT INTO schema_migrations (filename) VALUES (${file})`;
  }

  const tables = await sql`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename
  `;
  console.log(`[migrate] ✓ ${tables.length} public tables`);
}

main()
  .then(() => sql.end({ timeout: 5 }))
  .catch((err) => {
    console.error("[migrate] ✗", err.message);
    sql.end({ timeout: 1 }).finally(() => process.exit(1));
  });
