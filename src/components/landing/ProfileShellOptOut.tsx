"use client";

import { useEffect } from "react";

/**
 * Opts the global `.mobile-shell` out of the centered phone-frame on this
 * page, so the landing can present as a full-width premium experience on
 * desktop. Mobile (<768px) is unaffected — the shell is already full-bleed.
 *
 * If the shell is not yet mounted on first paint we watch the body via
 * `MutationObserver` and retry as soon as it appears, then clean up on
 * unmount. This prevents the layout from silently failing on slow renders
 * or when this component mounts before the layout's shell mounts.
 */
export function ProfileShellOptOut() {
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
