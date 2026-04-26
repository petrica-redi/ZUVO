import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import {
  ANON_ID_COOKIE,
  ANON_ID_MAX_AGE,
  ANON_ID_RESOLVE_HEADER,
  isValidAnonId,
} from "@/lib/anon-cookie";

const intlMiddleware = createMiddleware(routing);

function prepareAnon(
  request: NextRequest,
): { headers: Headers; isNew: boolean; id: string } {
  const existing = request.cookies.get(ANON_ID_COOKIE)?.value;
  if (isValidAnonId(existing)) {
    const headers = new Headers(request.headers);
    headers.set(ANON_ID_RESOLVE_HEADER, existing!);
    return { headers, isNew: false, id: existing! };
  }
  const id = globalThis.crypto.randomUUID();
  const headers = new Headers(request.headers);
  headers.set(ANON_ID_RESOLVE_HEADER, id);
  return { headers, isNew: true, id };
}

function applyAnonResponse(
  request: NextRequest,
  res: NextResponse,
  isNew: boolean,
  id: string,
) {
  if (isNew) {
    res.cookies.set(ANON_ID_COOKIE, id, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: ANON_ID_MAX_AGE,
      secure: process.env.NODE_ENV === "production",
    });
  }
  return res;
}

export default function middleware(request: NextRequest) {
  const { headers, isNew, id } = prepareAnon(request);

  if (request.nextUrl.pathname.startsWith("/api/")) {
    const res = NextResponse.next({ request: { headers } });
    return applyAnonResponse(request, res, isNew, id);
  }

  const req2 = new NextRequest(request, { headers });
  const res = intlMiddleware(req2);
  if (res instanceof NextResponse) {
    return applyAnonResponse(request, res, isNew, id);
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next|_vercel|monitoring|.*\\.(?:svg|png|jpg|ico|css|js|woff2?|ttf)).*)"],
};
