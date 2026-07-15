import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

type DbClient = ReturnType<typeof drizzle<typeof schema>>;

let singleton: DbClient | null | undefined;
let sqlClient: ReturnType<typeof postgres> | undefined;

/**
 * Returns the Drizzle database client, or `null` if `DATABASE_URL` is not set.
 * Uses postgres.js with Supabase/Neon pooler URLs (transaction mode, port 6543).
 */
export function getDb(): DbClient | null {
  if (singleton !== undefined) return singleton;

  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    return null;
  }

  sqlClient = postgres(url, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: "require",
    prepare: false,
  });
  singleton = drizzle(sqlClient, { schema });
  return singleton;
}

export type { DbClient as Database };
