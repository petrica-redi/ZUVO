import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { upsertOAuthStaffAccount } from "@/lib/staff/actions";

/**
 * OAuth / magic-link callback. Exchanges code for session, then upserts
 * staff_accounts and routes by approval status.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ locale: string }> },
) {
  const { locale } = await context.params;
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(`${origin}/${locale}/auth/login?error=oauth`);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data.user?.email) {
      return NextResponse.redirect(`${origin}/${locale}/auth/login?error=oauth`);
    }

    const result = await upsertOAuthStaffAccount({
      email: data.user.email,
      displayName:
        (data.user.user_metadata?.full_name as string | undefined) ||
        (data.user.user_metadata?.name as string | undefined) ||
        data.user.email.split("@")[0] ||
        "User",
      supabaseAuthId: data.user.id,
      provider: "google",
    });

    const dest = next || result.redirectTo || "/auth/pending";
    const path = dest.startsWith("/") ? `/${locale}${dest}` : dest;
    return NextResponse.redirect(`${origin}${path}`);
  } catch {
    return NextResponse.redirect(`${origin}/${locale}/auth/login?error=oauth`);
  }
}
