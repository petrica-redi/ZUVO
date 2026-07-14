"use client";

import type { ReactNode } from "react";
import { DemoPersonaProvider } from "@/components/demo/DemoPersonaProvider";
import { PersonaGuard } from "@/components/demo/PersonaGuard";

export function DemoShell({ children }: { children: ReactNode }) {
  return (
    <DemoPersonaProvider>
      <PersonaGuard>{children}</PersonaGuard>
    </DemoPersonaProvider>
  );
}
