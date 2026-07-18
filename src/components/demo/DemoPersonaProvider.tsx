"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEMO_MODE_KEY,
  DEMO_PERSONA_COOKIE,
  DEMO_PERSONAS,
  type DemoPersonaId,
} from "@/lib/demo/personas";
import {
  getPersonaModel,
  type PersonaModel,
} from "@/lib/demo/persona-models";
type DemoPersonaContextValue = {
  personaId: DemoPersonaId;
  model: PersonaModel;
  demoMode: boolean;
  setPersona: (id: DemoPersonaId) => void;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
};

const DemoPersonaContext = createContext<DemoPersonaContextValue | null>(null);

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`${name}=([^;]+)`));
  return match?.[1] ?? null;
}

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

function isValidPersona(id: string | null): id is DemoPersonaId {
  return DEMO_PERSONAS.some((p) => p.id === id);
}

function readInitialDemoState(): {
  personaId: DemoPersonaId;
  demoMode: boolean;
} {
  if (typeof window === "undefined") {
    return { personaId: "community", demoMode: false };
  }
  const storedMode = localStorage.getItem(DEMO_MODE_KEY);
  const cookiePersona = readCookie(DEMO_PERSONA_COOKIE);
  if (storedMode === "true" || cookiePersona) {
    const personaId = isValidPersona(cookiePersona) ? cookiePersona : "community";
    // Never seed/overwrite real mediator workspace data from demo personas.
    return { personaId, demoMode: storedMode !== "false" };
  }
  return { personaId: "community", demoMode: false };
}

export function DemoPersonaProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(readInitialDemoState);
  const [personaId, setPersonaId] = useState<DemoPersonaId>(initial.personaId);
  const [demoMode, setDemoMode] = useState(initial.demoMode);
  const hydrated = typeof window !== "undefined";

  const setPersona = useCallback((id: DemoPersonaId) => {
    setPersonaId(id);
    writeCookie(DEMO_PERSONA_COOKIE, id);
    localStorage.setItem(DEMO_MODE_KEY, "true");
    setDemoMode(true);
    // Intentionally do not write demo seed into production workspace keys.
  }, []);

  const enableDemoMode = useCallback(() => {
    localStorage.setItem(DEMO_MODE_KEY, "true");
    setDemoMode(true);
  }, []);

  const disableDemoMode = useCallback(() => {
    localStorage.setItem(DEMO_MODE_KEY, "false");
    clearCookie(DEMO_PERSONA_COOKIE);
    setDemoMode(false);
    setPersonaId("community");
  }, []);

  const value = useMemo<DemoPersonaContextValue>(
    () => ({
      personaId,
      model: getPersonaModel(personaId),
      demoMode: hydrated && demoMode,
      setPersona,
      enableDemoMode,
      disableDemoMode,
    }),
    [personaId, demoMode, hydrated, setPersona, enableDemoMode, disableDemoMode],
  );

  return (
    <DemoPersonaContext.Provider value={value}>{children}</DemoPersonaContext.Provider>
  );
}

export function useDemoPersona(): DemoPersonaContextValue {
  const ctx = useContext(DemoPersonaContext);
  if (!ctx) {
    return {
      personaId: "community",
      model: getPersonaModel("community"),
      demoMode: false,
      setPersona: () => {},
      enableDemoMode: () => {},
      disableDemoMode: () => {},
    };
  }
  return ctx;
}
