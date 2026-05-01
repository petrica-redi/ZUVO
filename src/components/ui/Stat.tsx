import type { ReactNode } from "react";
import { cn } from "./cn";

type Props = {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  tone?: "neutral" | "amber" | "indigo" | "emerald" | "rose";
  className?: string;
};

const TONE: Record<NonNullable<Props["tone"]>, string> = {
  neutral: "bg-white ring-gray-100",
  amber: "bg-gradient-to-br from-amber-50 to-orange-50 ring-amber-100",
  indigo: "bg-gradient-to-br from-indigo-50 to-violet-50 ring-indigo-100",
  emerald: "bg-gradient-to-br from-emerald-50 to-green-50 ring-emerald-100",
  rose: "bg-gradient-to-br from-rose-50 to-pink-50 ring-rose-100",
};

export function Stat({ label, value, hint, icon, tone = "neutral", className }: Props) {
  return (
    <div className={cn("flex items-center gap-3 rounded-2xl p-3 shadow-sm ring-1", TONE[tone], className)}>
      {icon && (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/80 ring-1 ring-black/5">
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</div>
        <div className="text-lg font-black leading-tight text-gray-900">{value}</div>
        {hint && <div className="text-[11px] font-medium text-gray-400">{hint}</div>}
      </div>
    </div>
  );
}
