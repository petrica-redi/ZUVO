import type { LucideIcon } from "lucide-react";
import {
  Home,
  MessageCircle,
  Search,
  Users,
  LayoutGrid,
  Shield,
  Navigation,
  GraduationCap,
  BarChart3,
  FileText,
  Stethoscope,
  Activity,
  Settings,
  Sparkles,
} from "lucide-react";
import type { DemoPersonaId } from "./personas";

export type PersonaNavTab = {
  key: string;
  href: string;
  Icon: LucideIcon;
  isPrimary?: boolean;
};

export type PersonaModel = {
  id: DemoPersonaId;
  roleSubtitleKey: string;
  homeHref: string;
  navTabs: PersonaNavTab[];
  allowedPrefixes: string[];
  accentVar: string;
  panelKey: "community" | "mediator" | "manager" | "doctor" | "admin";
};

const SHARED_MORE = "/more";
const DEMO = "/demo";

export const PERSONA_MODELS: Record<DemoPersonaId, PersonaModel> = {
  community: {
    id: "community",
    roleSubtitleKey: "roleCommunity",
    homeHref: "/chat",
    accentVar: "var(--color-brand-600)",
    panelKey: "community",
    allowedPrefixes: [
      "/",
      "/chat",
      "/explain",
      "/scan",
      "/symptoms",
      "/family",
      "/more",
      "/navigate",
      "/vaccines",
      "/rights",
      "/providers",
      "/learn",
      "/students",
      "/quiz",
      "/glossary",
      "/stories",
      DEMO,
      "/privacy",
      "/about",
      "/profile",
    ],
    navTabs: [
      { key: "home", href: "/", Icon: Home },
      { key: "ask", href: "/chat", Icon: MessageCircle, isPrimary: true },
      { key: "scan", href: "/scan", Icon: Search },
      { key: "family", href: "/family", Icon: Users },
      { key: "more", href: SHARED_MORE, Icon: LayoutGrid },
    ],
  },
  mediator: {
    id: "mediator",
    roleSubtitleKey: "roleMediator",
    homeHref: "/mediator",
    accentVar: "var(--color-blue-600)",
    panelKey: "mediator",
    allowedPrefixes: [
      "/mediator",
      "/scan",
      "/navigate",
      "/students",
      "/explain",
      SHARED_MORE,
      DEMO,
      "/about",
    ],
    navTabs: [
      { key: "field", href: "/mediator", Icon: Shield, isPrimary: true },
      { key: "scan", href: "/scan", Icon: Search },
      { key: "navigate", href: "/navigate", Icon: Navigation },
      { key: "training", href: "/students", Icon: GraduationCap },
      { key: "more", href: SHARED_MORE, Icon: LayoutGrid },
    ],
  },
  manager: {
    id: "manager",
    roleSubtitleKey: "roleManager",
    homeHref: "/impact",
    accentVar: "#7C3AED",
    panelKey: "manager",
    allowedPrefixes: ["/impact", "/methodology", DEMO, SHARED_MORE, "/about"],
    navTabs: [
      { key: "impact", href: "/impact", Icon: BarChart3, isPrimary: true },
      { key: "methodology", href: "/methodology", Icon: FileText },
      { key: "demo", href: DEMO, Icon: Sparkles },
      { key: "more", href: SHARED_MORE, Icon: LayoutGrid },
    ],
  },
  doctor: {
    id: "doctor",
    roleSubtitleKey: "roleDoctor",
    homeHref: "/consult",
    accentVar: "#DC2626",
    panelKey: "doctor",
    allowedPrefixes: ["/consult", "/symptoms", DEMO, SHARED_MORE, "/about"],
    navTabs: [
      { key: "queue", href: "/consult", Icon: Stethoscope, isPrimary: true },
      { key: "triage", href: "/symptoms", Icon: Activity },
      { key: "demo", href: DEMO, Icon: Sparkles },
      { key: "more", href: SHARED_MORE, Icon: LayoutGrid },
    ],
  },
  admin: {
    id: "admin",
    roleSubtitleKey: "roleAdmin",
    homeHref: "/admin/dashboard",
    accentVar: "#475569",
    panelKey: "admin",
    allowedPrefixes: ["/admin", DEMO, SHARED_MORE, "/about"],
    navTabs: [
      { key: "cms", href: "/admin/dashboard", Icon: Settings, isPrimary: true },
      { key: "demo", href: DEMO, Icon: Sparkles },
      { key: "more", href: SHARED_MORE, Icon: LayoutGrid },
    ],
  },
};

export function getPersonaModel(id: DemoPersonaId): PersonaModel {
  return PERSONA_MODELS[id];
}

export function stripLocalePrefix(pathname: string): string {
  const clean = pathname.replace(/^\/[a-z]{2,3}(?=\/|$)/, "") || "/";
  return clean === "" ? "/" : clean;
}

export function isPathAllowedForPersona(pathname: string, personaId: DemoPersonaId): boolean {
  const path = stripLocalePrefix(pathname);
  const model = PERSONA_MODELS[personaId];
  return model.allowedPrefixes.some((prefix) => {
    if (prefix === "/") return path === "/";
    return path === prefix || path.startsWith(`${prefix}/`);
  });
}

export function panelRouteForPersona(personaId: DemoPersonaId, pathname: string): boolean {
  const path = stripLocalePrefix(pathname);
  const home = stripLocalePrefix(PERSONA_MODELS[personaId].homeHref);
  return path === home || path.startsWith(`${home}/`);
}
