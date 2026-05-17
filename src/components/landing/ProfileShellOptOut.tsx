"use client";

import { useEffect } from "react";

/**
 * Opts the global `.mobile-shell` out of the centered phone-frame on this
 * page, so the landing can present as a full-width premium experience on
 * desktop. Mobile (<768px) is unaffected — the shell is already full-bleed.
 *
 * The class is automatically removed when the user navigates away.
 */
export function ProfileShellOptOut() {
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
