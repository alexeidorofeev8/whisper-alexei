"use client";

import { motion } from "framer-motion";
import { GrammarError, ErrorType } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

const ERROR_TOKEN_STYLES: Record<ErrorType, string> = {
  word_order:
    "bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200",
  case: "bg-red-100 text-red-700 border border-red-300 hover:bg-red-200",
  wrong_word:
    "bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-200",
  grammar:
    "bg-red-100 text-red-700 border border-red-300 hover:bg-red-200",
  article:
    "bg-orange-100 text-orange-700 border border-orange-300 hover:bg-orange-200",
  tense:
    "bg-purple-100 text-purple-700 border border-purple-300 hover:bg-purple-200",
  preposition:
    "bg-pink-100 text-pink-700 border border-pink-300 hover:bg-pink-200",
};

const SELECTED_STYLES: Record<ErrorType, string> = {
  word_order: "ring-1 ring-blue-400",
  case: "ring-1 ring-red-400",
  wrong_word: "ring-1 ring-amber-400",
  grammar: "ring-1 ring-red-400",
  article: "ring-1 ring-orange-400",
  tense: "ring-1 ring-purple-400",
  preposition: "ring-1 ring-pink-400",
};

interface AnimatedTokenProps {
  token: string;
  index: number;
  error?: GrammarError;
  layoutId?: string;
  delay?: number;
}

export function AnimatedToken({
  token,
  index,
  error,
  layoutId,
  delay = 0,
}: AnimatedTokenProps) {
  const selectedErrorId = useAppStore((s) => s.selectedErrorId);
  const setSelectedErrorId = useAppStore((s) => s.setSelectedErrorId);

  const isPunctuation = /^[.,!?;:]+$/.test(token);
  const isSelected = error && selectedErrorId === error.id;

  const handleClick = () => {
    if (!error) return;
    setSelectedErrorId(isSelected ? null : error.id);
  };

  return (
    <motion.span
      layout
      layoutId={layoutId}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + index * 0.04, duration: 0.25, ease: "easeOut" }}
      onClick={handleClick}
      className={cn(
        "inline-block font-mono text-sm rounded-md transition-all duration-150",
        isPunctuation ? "px-0.5" : "px-2 py-0.5",
        error
          ? cn(
              ERROR_TOKEN_STYLES[error.type],
              "cursor-pointer",
              isSelected ? SELECTED_STYLES[error.type] : ""
            )
          : "text-slate-700"
      )}
    >
      {token}
    </motion.span>
  );
}
