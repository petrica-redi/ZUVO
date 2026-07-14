"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "@/navigation";
import { useDemoPersona } from "@/components/demo/DemoPersonaProvider";
import { isPathAllowedForPersona } from "@/lib/demo/persona-models";

/**
 * When demo mode is active, redirects users away from routes their persona
 * cannot access — enforcing Dawa-style role boundaries.
 */
export function PersonaGuard({ children }: { children: React.ReactNode }) {
  const { demoMode, personaId, model } = useDemoPersona();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!demoMode) return;
    if (!isPathAllowedForPersona(pathname, personaId)) {
      router.replace(model.homeHref);
    }
  }, [demoMode, pathname, personaId, model.homeHref, router]);

  return <>{children}</>;
}
