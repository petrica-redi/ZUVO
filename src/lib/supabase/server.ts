import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "@/lib/env";

/**
 * Server-side Supabase client with cookie-based session management.
 * Use in Server Components, Route Handlers, and Server Actions.
 */
export async function createClient() {
  const cfg = getSupabaseConfig();
  if (!cfg) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(cfg.url, cfg.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // `setAll` is called from Server Components where cookies are read-only.
          // Route Handlers and Server Actions can set cookies without error.
        }
      },
    },
  });
}

/**
 * Admin client that bypasses RLS. Only use in trusted server contexts.
 * Requires SUPABASE_SERVICE_ROLE_KEY.
 */
export async function createAdminClient() {
  const cfg = getSupabaseConfig();
  if (!cfg?.serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for admin operations.");
  }

  const cookieStore = await cookies();

  return createServerClient(cfg.url, cfg.serviceRoleKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Component context — ignore.
        }
      },
    },
  });
}
