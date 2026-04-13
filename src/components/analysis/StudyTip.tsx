"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

const LEVEL_COLORS: Record<string, string> = {
  A2: "bg-slate-100 text-slate-600 border border-slate-200",
  B1: "bg-blue-50 text-blue-700 border border-blue-200",
  B2: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  C1: "bg-violet-50 text-violet-700 border border-violet-200",
  C2: "bg-orange-50 text-orange-700 border border-orange-200",
};

export function StudyTip({ tip, level }: { tip: string; level: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.75 }}
      className="flex items-start gap-2.5 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl"
    >
      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-amber-900 leading-relaxed">{tip}</p>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${LEVEL_COLORS[level] ?? "bg-slate-100 text-slate-600"}`}>
        {level}
      </span>
    </motion.div>
  );
}
