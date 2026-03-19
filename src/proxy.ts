import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all request paths except Next.js internals and static files
  matcher: ["/((?!_next|_vercel|monitoring|.*\\.(?:svg|png|jpg|ico|css|js|woff2?|ttf)).*)"],
};
