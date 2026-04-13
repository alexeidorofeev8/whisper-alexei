"use client";

import { motion } from "framer-motion";
import { GrammarError } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

const ERROR_STYLES: Record<GrammarError["type"], { border: string; bg: string; badge: string; label: string }> = {
  word_order: {
    border: "border-l-blue-400",
    bg: "bg-blue-50",
    badge: "bg-blue-100 text-blue-700 border border-blue-200",
    label: "Wortstellung",
  },
  case: {
    border: "border-l-red-400",
    bg: "bg-red-50",
    badge: "bg-red-100 text-red-700 border border-red-200",
    label: "Kasus",
  },
  wrong_word: {
    border: "border-l-amber-400",
    bg: "bg-amber-50",
    badge: "bg-amber-100 text-amber-700 border border-amber-200",
    label: "Wortwahl",
  },
  grammar: {
    border: "border-l-red-400",
    bg: "bg-red-50",
    badge: "bg-red-100 text-red-700 border border-red-200",
    label: "Grammatik",
  },
};

export function ErrorCard({ error, index }: { error: GrammarError; index: number }) {
  const selectedErrorId = useAppStore((s) => s.selectedErrorId);
  const setSelectedErrorId = useAppStore((s) => s.setSelectedErrorId);
  const styles = ERROR_STYLES[error.type];
  const isSelected = selectedErrorId === error.id;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.08 }}
      onClick={() => setSelectedErrorId(isSelected ? null : error.id)}
      className={cn(
        "border-l-2 pl-3 pr-3 py-2.5 rounded-r-xl cursor-pointer transition-all duration-200",
        styles.border,
        styles.bg,
        isSelected ? "ring-1 ring-slate-300" : "hover:brightness-[0.97]"
      )}
    >
      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
        <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", styles.badge)}>
          {styles.label}
        </span>
        <span className="text-xs text-slate-400 font-mono">{error.rule_name}</span>
      </div>

      <p className="text-sm text-slate-700 leading-relaxed">{error.explanation}</p>

      {error.correct_word && (
        <p className="mt-1.5 text-xs text-slate-500">
          Korrekt:{" "}
          <span className="font-mono font-semibold text-teal-700">
            {error.correct_word}
          </span>
        </p>
      )}
    </motion.div>
  );
}
