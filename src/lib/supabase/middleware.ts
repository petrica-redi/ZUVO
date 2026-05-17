import { createServerClient } from "@supabase/ssr";
import { type NextRequest, type NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/env";

export async function updateSession(req: NextRequest, res: NextResponse) {
  const cfg = getSupabaseConfig();
  if (!cfg) return res;

  const supabase = createServerClient(cfg.url, cfg.anonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          req.cookies.set(name, value),
        );
        cookiesToSet.forEach(({ name, value, options }) =>
          res.cookies.set(name, value, options),
        );
      },
    },
  });

  await supabase.auth.getUser();
  return res;
}
