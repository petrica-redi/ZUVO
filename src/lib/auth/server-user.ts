/**
 * Unified server-side user resolution.
 *
 * Tries in order:
 *   1. Authenticated Supabase session (cookie-based, trusted).
 *   2. Validated anonymous-id header (legacy, low-trust).
 *
 * Returns a `ResolvedUser` with `kind: "authenticated"` or `"anonymous"` so
 * route handlers can apply different policies if needed.
 */

import type { NextRequest } from "next/server";
import { getAnonymousId } from "@/lib/api/validation";
import { getSupabaseConfig } from "@/lib/env";

export type ResolvedUser =
  | {
      kind: "authenticated";
      id: string;
      anonId: string | null;
      email: string | null;
      isAnonymous: boolean;
    }
  | {
      kind: "anonymous";
      id: string; // The anonymous-id header value
      anonId: string;
      email: null;
      isAnonymous: true;
    }
  | null;

/**
 * Resolves the current user. Returns null if neither auth nor a valid
 * anonymous header is present.
 *
 * Safe for any server context (Route Handler, Server Component, Action).
 * Never throws; auth failures degrade gracefully to header-based mode.
 */
export async function resolveUser(req: NextRequest): Promise<ResolvedUser> {
  // 1. Try Supabase session if configured.
  if (getSupabaseConfig()) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const hasAuthCookie = req.cookies.getAll().some((c) => c.name.includes("-auth-token"));
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        const headerAnon = getAnonymousId(req);
        return {
          kind: "authenticated",
          id: data.user.id,
          anonId: headerAnon,
          email: data.user.email ?? null,
          isAnonymous: data.user.is_anonymous ?? false,
        };
      } else if (hasAuthCookie) {
        // Cookie is present but invalid/expired/unreachable. 
        // Do not silently downgrade to anonymous identity.
        return null;
      }
    } catch {
      // Supabase unreachable or misconfigured.
      // If there's an auth cookie, we should not fallback to anonymous.
      if (req.cookies.getAll().some((c) => c.name.includes("-auth-token"))) {
        return null;
      }
    }
  }

  // 2. Fall back to validated anonymous-id header.
  const headerAnon = getAnonymousId(req);
  if (headerAnon) {
    return {
      kind: "anonymous",
      id: headerAnon,
      anonId: headerAnon,
      email: null,
      isAnonymous: true,
    };
  }

  return null;
}

/**
 * Strict variant — returns the user or throws a typed Error.
 * Use only on routes that absolutely require an identity.
 */
export class UnauthorizedError extends Error {
  constructor(message = "Authentication required") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export async function requireUser(req: NextRequest): Promise<NonNullable<ResolvedUser>> {
  const user = await resolveUser(req);
  if (!user) throw new UnauthorizedError();
  return user;
}

/**
 * Returns true if the resolved user is fully authenticated (has a Supabase
 * session, not just an anonymous-id header).
 */
export function isAuthenticated(user: ResolvedUser): boolean {
  return user?.kind === "authenticated";
}
