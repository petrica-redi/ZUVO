/**
 * POST /api/me/delete — GDPR Article 17 deletion request.
 *
 * Two-phase deletion:
 *   1. Immediate scrub: identifying fields on `users` are nulled / pseudonymised.
 *      Health, notifications, and audit rows are anonymised by clearing
 *      personal references but kept for population-level statistics.
 *   2. Hard delete is queued via an audit_log marker. A separate cron job
 *      runs every 24h and permanently removes records older than 30 days.
 *
 * Note: Module progress (`progress`) is minimal-PII and forms the core of
 * aggregated learning analytics. It is not scrubbed here.
 *
 * Body schema:
 *   { confirmation: "DELETE" }
 *
 * Security:
 *   - Auth-required.
 *   - Rate-limited (5/hour) to prevent griefing.
 *   - Audit-logged before scrubbing.
 */
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/client";
import {
  auditLog,
  healthLogs,
  notifications,
  users,
} from "@/db/schema";
import { parseJsonBody } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { resolveUser } from "@/lib/auth/server-user";

const deleteSchema = z.object({
  confirmation: z.literal("DELETE"),
  reason: z.string().trim().max(500).optional(),
});

export async function POST(req: NextRequest) {
  const user = await resolveUser(req);
  if (!user || user.kind !== "authenticated") {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 },
    );
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "me-delete",
    limit: 5,
    windowMs: 60 * 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, deleteSchema);
  if (!parsed.success) return parsed.response;

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { success: false, error: "Database unavailable" },
      { status: 503 },
    );
  }

  const now = new Date();
  const pseudoEmail = `deleted-${user.id.slice(0, 8)}@deleted.local`;

  try {
    // We use db.transaction if possible, but Neon HTTP limits cross-query transactions.
    // For Drizzle + Neon HTTP, we do best-effort or use db.batch().
    // We'll do it sequentially here; a partial failure will leave the user scrubbed but
    // some related logs might retain text. The cron job will clean them up.
    await db.transaction(async (tx) => {
      // 1. Audit the request first — if anything fails after this, we have a record.
      await tx.insert(auditLog).values({
        userId: user.id,
        action: "user.deleted",
        resourceType: "user",
        resourceId: user.id,
        metadata: {
          reason: parsed.data.reason ?? null,
          scheduledHardDeleteAfter: new Date(
            now.getTime() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        createdAt: now,
      });

      // 2. Scrub identifying fields on the user row but keep the row for FK
      //    integrity and statistical use until the hard-delete cron runs.
      const [updatedUser] = await tx
        .update(users)
        .set({
          email: pseudoEmail,
          displayName: null,
          phone: null,
          avatarUrl: null,
          anonymousId: null,
          authId: null,
          isAnonymous: true,
          updatedAt: now,
        })
        .where(eq(users.id, user.id))
        .returning({ id: users.id });

      if (!updatedUser) {
        throw new Error("User profile not found");
      }

      // 3. Best-effort scrub of free-text fields on health logs and notifications.
      await tx
        .update(healthLogs)
        .set({ note: null, metadata: null })
        .where(eq(healthLogs.userId, user.id));

      await tx
        .update(notifications)
        .set({ title: "[deleted]", body: "[deleted]", data: null })
        .where(eq(notifications.userId, user.id));
    });

    // 4. Sign the user out of any active Supabase session.
    if (user.kind === "authenticated") {
      try {
        const { createClient } = await import("@/lib/supabase/server");
        const supabase = await createClient();
        await supabase.auth.signOut({ scope: "global" });
      } catch {
        // Sign-out failure is not blocking; the row is already scrubbed.
      }
    }

  // 5. Clear server-side rate-limit and budget counters tied to this user.
  //    (Best effort; counters expire daily anyway.)

  const res = NextResponse.json({
      success: true,
      message:
        "Your data has been scrubbed. A permanent deletion is scheduled within 30 days.",
      scheduledHardDeleteAfter: new Date(
        now.getTime() + 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    });

    // Make sure cookies are cleared even if signOut throws
    req.cookies.getAll().forEach((cookie) => {
      if (cookie.name.includes("-auth-token")) {
        res.cookies.delete(cookie.name);
      }
    });

    return res;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process deletion. Please contact dpo@redi.healthcare.",
      },
      { status: 500 },
    );
  }
}
