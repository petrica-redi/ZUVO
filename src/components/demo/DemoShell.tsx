"use client";

import type { ReactNode } from "react";
import { DemoPersonaProvider } from "@/components/demo/DemoPersonaProvider";
import { PersonaGuard } from "@/components/demo/PersonaGuard";
import { DemoFab } from "@/components/demo/DemoFab";
import { PersonaWelcome } from "@/components/demo/PersonaWelcome";

export function DemoShell({ children }: { children: ReactNode }) {
  return (
    <DemoPersonaProvider>
      <PersonaGuard>
        {children}
        <DemoFab />
        <PersonaWelcome />
      </PersonaGuard>
    </DemoPersonaProvider>
  );
}
