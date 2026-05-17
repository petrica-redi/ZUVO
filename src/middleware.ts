import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { inferShellModeFromUserAgent } from "./lib/device-shell";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

function applySecurityHeaders(res: NextResponse) {
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-Frame-Options", "DENY");
  // Voice features (mic, camera for prescription scan) require self origin.
  res.headers.set(
    "Permissions-Policy",
    "camera=(self), microphone=(self), geolocation=(self)"
  );
  return res;
}

export default async function middleware(req: NextRequest) {
  const shellMode = inferShellModeFromUserAgent(req.headers.get("user-agent"));
  const requestHeaders = new Headers(req.headers);
  // New canonical header; keep the legacy `x-sastipe-shell-mode` alias for one
  // release so any cached server bundles still resolve the shell mode correctly.
  requestHeaders.set("x-redi-shell-mode", shellMode);
  requestHeaders.set("x-sastipe-shell-mode", shellMode);

  let res: NextResponse;

  if (req.nextUrl.pathname.startsWith("/api/") || req.nextUrl.pathname === "/offline.html") {
    res = NextResponse.next({ request: { headers: requestHeaders } });
  } else {
    const localizedReq = new NextRequest(req.nextUrl, {
      headers: requestHeaders,
    });
    res = intlMiddleware(localizedReq);
  }

  res = await updateSession(req, res);
  return applySecurityHeaders(res);
}

export const config = {
  matcher: ["/((?!_next|_vercel|monitoring|.*\\.(?:svg|png|jpg|ico|css|js|txt|xml|woff2?|ttf)).*)"],
};
