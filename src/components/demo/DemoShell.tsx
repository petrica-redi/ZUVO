"use client";

import type { ReactNode } from "react";
import { DemoPersonaProvider } from "@/components/demo/DemoPersonaProvider";
import { PersonaGuard } from "@/components/demo/PersonaGuard";
import { PersonaWelcome } from "@/components/demo/PersonaWelcome";
import { AdminPersonaBanner } from "@/components/admin/AdminPersonaBanner";

export function DemoShell({ children }: { children: ReactNode }) {
  return (
    <DemoPersonaProvider>
      <PersonaGuard>
        {children}
        <PersonaWelcome />
        <AdminPersonaBanner />
      </PersonaGuard>
    </DemoPersonaProvider>
  );
}
