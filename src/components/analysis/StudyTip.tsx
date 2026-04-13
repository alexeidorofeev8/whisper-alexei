"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

const LEVEL_COLORS: Record<string, string> = {
  A2: "bg-zinc-700 text-zinc-300",
  B1: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  B2: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
  C1: "bg-violet-500/20 text-violet-300 border border-violet-500/30",
  C2: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
};

export function StudyTip({
  tip,
  level,
}: {
  tip: string;
  level: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.75 }}
      className="flex items-start gap-2.5 px-3 py-2.5 bg-amber-500/5 border border-amber-500/20 rounded-xl"
    >
      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-amber-200/90 leading-relaxed">{tip}</p>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${LEVEL_COLORS[level] ?? "bg-zinc-700 text-zinc-300"}`}>
        {level}
      </span>
    </motion.div>
  );
}
