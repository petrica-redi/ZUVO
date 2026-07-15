"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "@/navigation";
import { useDemoPersona } from "@/components/demo/DemoPersonaProvider";
import {
  isPathAllowedForPersona,
  stripLocalePrefix,
} from "@/lib/demo/persona-models";

/** Routes any visitor can reach — never blocked by persona preview guard. */
const PUBLIC_PATHS = new Set([
  "/",
  "/privacy",
  "/about",
  "/demo",
  "/admin/login",
  "/providers",
  "/methodology",
  "/impact",
  "/students",
]);

function isPublicPath(pathname: string): boolean {
  const path = stripLocalePrefix(pathname);
  if (PUBLIC_PATHS.has(path)) return true;
  return path.startsWith("/admin/login");
}

/**
 * During admin stakeholder preview only, redirects away from routes the active
 * persona cannot access. Clears stale demo mode for visitors without admin session.
 */
export function PersonaGuard({ children }: { children: React.ReactNode }) {
  const { demoMode, personaId, model, disableDemoMode } = useDemoPersona();
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d: { authenticated?: boolean }) => {
        if (cancelled) return;
        const authed = !!d.authenticated;
        setIsAdmin(authed);
        if (!authed) disableDemoMode();
      })
      .catch(() => {
        if (cancelled) return;
        setIsAdmin(false);
        disableDemoMode();
      });

    return () => {
      cancelled = true;
    };
  }, [disableDemoMode]);

  useEffect(() => {
    if (!demoMode || isAdmin !== true) return;

    const path = stripLocalePrefix(pathname);
    const home = stripLocalePrefix(model.homeHref);

    if (isPublicPath(pathname)) return;
    if (path === home || path.startsWith(`${home}/`)) return;
    if (isPathAllowedForPersona(pathname, personaId)) return;

    router.replace(model.homeHref);
  }, [demoMode, isAdmin, pathname, personaId, model.homeHref, router]);

  return <>{children}</>;
}
