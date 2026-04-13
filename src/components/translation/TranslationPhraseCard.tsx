"use client";

import { motion } from "framer-motion";
import { TranslationPhrase } from "@/lib/types";

const DIFFICULTY_STYLES = {
  easy: "bg-green-100 text-green-700 border border-green-200",
  medium: "bg-amber-100 text-amber-700 border border-amber-200",
  hard: "bg-red-100 text-red-700 border border-red-200",
} as const;

const DIFFICULTY_LABELS = {
  easy: "Лёгкий",
  medium: "Средний",
  hard: "Сложный",
} as const;

interface TranslationPhraseCardProps {
  phrase: TranslationPhrase;
}

export function TranslationPhraseCard({ phrase }: TranslationPhraseCardProps) {
  const langName = phrase.targetLanguage === "en" ? "English" : "Deutsch";

  return (
    <motion.div
      key={phrase.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-5 shadow-sm flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
          Переведите на {langName}
        </p>
        <span
          className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${DIFFICULTY_STYLES[phrase.difficulty]}`}
        >
          {DIFFICULTY_LABELS[phrase.difficulty]}
        </span>
      </div>
      <p className="text-2xl font-medium text-slate-900 leading-relaxed">
        {phrase.russian}
      </p>
    </motion.div>
  );
}
