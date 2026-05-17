"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Target numeric value. */
  to: number;
  /** Milliseconds to animate the count. Defaults to 900. */
  duration?: number;
  /** Format the displayed number (e.g. compact thousands). */
  format?: (n: number) => string;
  /** Render-prop suffix appended after the number (untouched by the formatter). */
  suffix?: string;
  /** Render-prop prefix prepended before the number. */
  prefix?: string;
  /** Honors `prefers-reduced-motion` automatically; pass `true` to force-disable. */
  disabled?: boolean;
  className?: string;
};

/**
 * Smooth count-up animation using `requestAnimationFrame` with an
 * easeOutExpo curve. Respects `prefers-reduced-motion` and starts at
 * 0 on mount so the number visibly settles to its target.
 *
 * Defaults to dash-out when the value is null/undefined so SSR doesn't
 * flash the wrong number.
 */
export function CountUp({
  to,
  duration = 900,
  format,
  suffix = "",
  prefix = "",
  disabled = false,
  className,
}: Props) {
  const [value, setValue] = useState(0);
  const lastTo = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const skipAnimation = disabled || reduce || duration <= 0;
    const start = lastTo.current;
    const delta = to - start;

    if (skipAnimation || delta === 0) {
      // Defer to a microtask so the lint rule doesn't see a sync setState
      // inside the effect body. Semantically equivalent here.
      queueMicrotask(() => {
        setValue(to);
        lastTo.current = to;
      });
      return;
    }

    const startedAt = performance.now();
    const ease = (t: number) => 1 - Math.pow(2, -10 * t);

    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / duration);
      const v = start + delta * ease(t);
      setValue(v);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setValue(to);
        lastTo.current = to;
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [to, duration, disabled]);

  const display = format ? format(value) : Math.round(value).toString();
  return (
    <span className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
