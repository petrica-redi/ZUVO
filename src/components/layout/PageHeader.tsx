import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  action?: ReactNode;
};

/**
 * Consistent top-of-screen title block (Level 3 typography hierarchy).
 */
export function PageHeader({ title, subtitle, eyebrow, action }: Props) {
  return (
    <div className="mb-6 flex items-start justify-between gap-3 px-1">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#A93226]/90">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-[1.6rem] font-black leading-tight tracking-[-0.03em] text-slate-900">
          {title}
        </h1>
        {subtitle ? <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0 pt-0.5">{action}</div> : null}
    </div>
  );
}
