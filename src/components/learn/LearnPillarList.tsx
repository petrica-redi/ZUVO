"use client";

import { Link } from "@/navigation";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion-variants";

const pillars = [
  { id: "prevention", emoji: "🛡️", color: "#16A34A", href: "/learn/prevention" },
  { id: "nutrition", emoji: "🥗", color: "#2563EB", href: "/learn/nutrition" },
  { id: "maternal", emoji: "🤱", color: "#9333EA", href: "/learn/maternal" },
  { id: "children", emoji: "👶", color: "#EA580C", href: "/learn/children" },
  { id: "chronic", emoji: "💊", color: "#DC2626", href: "/learn/chronic" },
  { id: "mental", emoji: "🧠", color: "#0891B2", href: "/learn/mental" },
] as const;

type Props = {
  labels: Record<(typeof pillars)[number]["id"], string>;
};

export function LearnPillarList({ labels }: Props) {
  return (
    <motion.ul
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-2.5"
    >
      {pillars.map((pillar) => (
        <motion.li key={pillar.id} variants={staggerItem}>
          <Link
            href={pillar.href}
            className="group flex items-center gap-4 rounded-2xl border border-white/60 bg-white/80 p-4 shadow-[0_2px_12px_rgba(15,23,42,0.04)] backdrop-blur-md transition-all active:scale-[0.99] hover:border-white/90 hover:shadow-[0_4px_20px_rgba(15,23,42,0.07)]"
          >
            <span
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-inner ring-1 ring-black/5 transition-transform group-active:scale-95"
              style={{ backgroundColor: `${pillar.color}18` }}
            >
              {pillar.emoji}
            </span>
            <span className="flex-1 text-[15px] font-bold tracking-tight text-slate-800">
              {labels[pillar.id]}
            </span>
            <ChevronRight className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[#C0392B]" />
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );
}
