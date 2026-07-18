/**
 * Probe Supabase Auth to see if the Google provider is enabled.
 * When disabled, `/auth/v1/authorize?provider=google` returns 400 JSON
 * instead of redirecting to Google — which previously dumped raw JSON
 * into the browser after "Continue with Google".
 */
export async function isGoogleOAuthEnabled(): Promise<boolean> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return false;

  const redirectTo =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "https://redi.healthcare";

  try {
    const res = await fetch(
      `${base}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(`${redirectTo}/auth/callback`)}`,
      {
        method: "GET",
        redirect: "manual",
        cache: "no-store",
        headers: { Accept: "application/json" },
      },
    );

    // Enabled → redirect to accounts.google.com (3xx) or HTML login
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location") || "";
      return /google/i.test(location);
    }

    if (res.status === 400 || res.status === 422) return false;

    const body = await res.text();
    if (/not enabled|unsupported provider/i.test(body)) return false;

    return res.ok;
  } catch {
    return false;
  }
}
