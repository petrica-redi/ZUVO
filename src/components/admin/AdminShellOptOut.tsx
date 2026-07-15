"use client";

import { useEffect } from "react";

/** Full-width admin CMS — opts out of the centered phone-frame shell. */
export function AdminShellOptOut() {
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
      return () => target?.classList.remove("landing-shell");
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
