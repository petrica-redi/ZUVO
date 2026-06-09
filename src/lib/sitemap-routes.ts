import { PILLARS } from "@/data/content";
import { REGIONS } from "@/data/regions";
import { STUDENT_MODULES, STAGE_ORDER } from "@/data/student-health";

/** Public app routes included in sitemap.xml (excludes admin and API). */
export function getPublicSitemapRoutes(): string[] {
  const learnPillarRoutes = PILLARS.map((p) => `/learn/${p.id}`);
  const learnModuleRoutes = PILLARS.flatMap((p) =>
    p.modules.map((m) => `/learn/${p.id}/${m.id}`),
  );
  const regionRoutes = REGIONS.map((r) => `/regions/${r.id}`);

  const studentRoutes = [
    "/students",
    "/students/certificate",
    ...STAGE_ORDER.map((s) => `/students/quiz/${s}`),
    ...STUDENT_MODULES.map((m) => `/students/${m.stageId}/${m.id}`),
  ];

  const staticRoutes = [
    "/",
    "/chat",
    "/scan",
    "/explain",
    "/symptoms",
    "/consult",
    "/navigate",
    "/vaccines",
    "/providers",
    "/learn",
    "/track",
    "/family",
    "/profile",
    "/mediator",
    "/more",
    "/about",
    "/privacy",
    "/methodology",
    "/impact",
    "/glossary",
    "/quiz",
    "/rights",
    "/stories",
    "/challenges",
  ];

  return [
    ...staticRoutes,
    ...learnPillarRoutes,
    ...learnModuleRoutes,
    ...regionRoutes,
    ...studentRoutes,
  ];
}
