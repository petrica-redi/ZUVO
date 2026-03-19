import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "@/lib/env";

/**
 * Browser-side Supabase client.
 * Call inside Client Components / event handlers.
 * Throws at runtime only when the env vars are truly absent (caught early).
 */
export function createClient() {
  const cfg = getSupabaseConfig();
  if (!cfg) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  return createBrowserClient(cfg.url, cfg.anonKey);
}
