"use client";

import { useEffect } from "react";

function sanitizeRoute(raw: string): string | null {
  try {
    const decoded = decodeURIComponent(raw)
      .replace(/^web\+(sastipe|redihealth):\/\//i, "")
      .trim();
    const path = decoded.startsWith("/") ? decoded : `/${decoded}`;
    if (!/^\/[A-Za-z0-9/_?=&.-]*$/.test(path)) return null;
    if (path.startsWith("//") || path.startsWith("/api/")) return null;
    return path;
  } catch {
    return null;
  }
}

export function ProtocolRouteHandler() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const target = params.get("route");
    if (!target) return;
    const path = sanitizeRoute(target);
    if (path) window.location.replace(path);
  }, []);

  return null;
}
