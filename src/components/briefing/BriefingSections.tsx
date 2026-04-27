"use client";

import { motion } from "framer-motion";
import { pageEnter, staggerContainer, staggerItem } from "@/lib/motion-variants";
import { FrostPanel } from "@/components/ui/FrostPanel";

type Section = { title: string; body: string };

type Props = {
  kicker: string;
  pageTitle: string;
  sections: Section[];
  /** Tailwind text color class for the kicker line */
  kickerClassName?: string;
  footer: string;
};

/**
 * Staggered frosted section cards for policy / briefing pages (MoH, CoE, etc.).
 */
export function BriefingSections({
  kicker,
  pageTitle,
  sections,
  kickerClassName = "text-[#A93226]/90",
  footer,
}: Props) {
  return (
    <motion.div {...pageEnter} className="px-1">
      <p className={`text-[11px] font-extrabold uppercase tracking-[0.14em] ${kickerClassName}`}>{kicker}</p>
      <h1 className="mt-1.5 text-[1.5rem] font-black leading-tight tracking-[-0.03em] text-slate-900">
        {pageTitle}
      </h1>
      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mt-6 list-none space-y-3.5 p-0"
      >
        {sections.map((s) => (
          <motion.li key={s.title} variants={staggerItem} className="text-left">
            <FrostPanel padding="md" className="border-slate-200/50">
              <h2 className="text-sm font-extrabold text-slate-900">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 whitespace-pre-line">{s.body}</p>
            </FrostPanel>
          </motion.li>
        ))}
      </motion.ul>
      <p className="mt-8 text-center text-[10px] font-medium text-slate-400">{footer}</p>
    </motion.div>
  );
}
