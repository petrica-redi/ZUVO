import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type DbClient = ReturnType<typeof drizzle<typeof schema>>;

let singleton: DbClient | null | undefined;

/**
 * Returns the Drizzle database client, or `null` if `DATABASE_URL` is not set.
 * Initializes lazily on first call so that importing this module never crashes
 * at build time or in environments where the DB is not configured.
 */
export function getDb(): DbClient | null {
  if (singleton !== undefined) return singleton;

  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    singleton = null;
    return null;
  }

  const sql = neon(url);
  singleton = drizzle(sql, { schema });
  return singleton;
}

export type { DbClient as Database };
