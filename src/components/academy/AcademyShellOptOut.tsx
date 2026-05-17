"use client";

import { useEffect } from "react";

/**
 * Lets the Student Health Academy break out of the centered mobile-shell
 * box on desktop so it can present as a full-width premium experience.
 * Mobile (<768px) is unaffected.
 */
export function AcademyShellOptOut() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const shell = document.querySelector(".mobile-shell");
    if (!shell) return;
    shell.classList.add("landing-shell");
    return () => {
      shell.classList.remove("landing-shell");
    };
  }, []);
  return null;
}
