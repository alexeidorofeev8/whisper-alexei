"use client";

import { motion } from "framer-motion";
import { GrammarError } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

const ERROR_STYLES: Record<GrammarError["type"], { border: string; bg: string; badge: string; label: string }> = {
  word_order: {
    border: "border-l-blue-500",
    bg: "bg-blue-500/5",
    badge: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
    label: "Wortstellung",
  },
  case: {
    border: "border-l-red-500",
    bg: "bg-red-500/5",
    badge: "bg-red-500/15 text-red-300 border border-red-500/30",
    label: "Kasus",
  },
  wrong_word: {
    border: "border-l-amber-500",
    bg: "bg-amber-500/5",
    badge: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    label: "Wortwahl",
  },
  grammar: {
    border: "border-l-red-500",
    bg: "bg-red-500/5",
    badge: "bg-red-500/15 text-red-300 border border-red-500/30",
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
      onClick={() =>
        setSelectedErrorId(isSelected ? null : error.id)
      }
      className={cn(
        "border-l-2 pl-3 pr-3 py-2.5 rounded-r-xl cursor-pointer transition-all duration-200",
        styles.border,
        styles.bg,
        isSelected ? "ring-1 ring-white/10" : "hover:brightness-110"
      )}
    >
      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
        <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", styles.badge)}>
          {styles.label}
        </span>
        <span className="text-xs text-zinc-500 font-mono">{error.rule_name}</span>
      </div>

      <p className="text-sm text-zinc-300 leading-relaxed">{error.explanation}</p>

      {error.correct_word && (
        <p className="mt-1.5 text-xs text-zinc-400">
          Korrekt:{" "}
          <span className="font-mono font-semibold text-emerald-400">
            {error.correct_word}
          </span>
        </p>
      )}
    </motion.div>
  );
}
