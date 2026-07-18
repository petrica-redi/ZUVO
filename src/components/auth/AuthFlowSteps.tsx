/** Visual stepper for staff registration: create → verify → approve → sign in */

export type AuthFlowStep = "register" | "verify" | "pending" | "login";

const STEP_ORDER: AuthFlowStep[] = ["register", "verify", "pending", "login"];

export function AuthFlowSteps({
  active,
  labels,
}: {
  active: AuthFlowStep;
  labels: {
    register: string;
    verify: string;
    pending: string;
    login: string;
  };
}) {
  const activeIndex = STEP_ORDER.indexOf(active);

  return (
    <ol
      className="mb-6 grid grid-cols-4 gap-1 sm:gap-2"
      aria-label="Registration steps"
    >
      {STEP_ORDER.map((step, index) => {
        const done = index < activeIndex;
        const current = index === activeIndex;
        const label = labels[step];
        return (
          <li
            key={step}
            className={`rounded-xl px-1.5 py-2 text-center sm:px-2 ${
              current
                ? "bg-[var(--color-ink-900)] text-white"
                : done
                  ? "bg-[var(--color-success-bg)] text-[var(--color-success-text)]"
                  : "bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]"
            }`}
          >
            <span className="block text-[10px] font-extrabold uppercase tracking-wider">
              {index + 1}
            </span>
            <span className="mt-0.5 block text-[10px] font-bold leading-tight sm:text-[11px]">
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
