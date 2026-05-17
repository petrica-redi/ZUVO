"use client";

import { useEffect } from "react";

/**
 * Lets the Student Health Academy break out of the centered mobile-shell
 * box on desktop so it can present as a full-width premium experience.
 * Mobile (<768px) is unaffected.
 *
 * Watches the body via `MutationObserver` and retries as soon as the
 * shell appears, so the layout doesn't silently fail when this component
 * mounts before the shell.
 */
export function AcademyShellOptOut() {
  useEffect(() => {
    if (typeof document === "undefined") return;

    let target: Element | null = null;
    const apply = (el: Element) => {
      target = el;
      el.classList.add("landing-shell");
    };

    const found = document.querySelector(".mobile-shell");
    if (found) {
      apply(found);
      return () => {
        target?.classList.remove("landing-shell");
      };
    }

    const observer = new MutationObserver(() => {
      const el = document.querySelector(".mobile-shell");
      if (el) {
        apply(el);
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      target?.classList.remove("landing-shell");
    };
  }, []);
  return null;
}
