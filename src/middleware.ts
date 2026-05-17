import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/") || req.nextUrl.pathname === "/offline.html") {
    return NextResponse.next();
  }

  const res = intlMiddleware(req);
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self)"
  );
  return res;
}

export const config = {
  matcher: ["/((?!_next|_vercel|monitoring|.*\\.(?:svg|png|jpg|ico|css|js|txt|xml|woff2?|ttf)).*)"],
};
