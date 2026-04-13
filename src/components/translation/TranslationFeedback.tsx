"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, XCircle, Sparkles } from "lucide-react";
import { TranslationResult } from "@/lib/types";
import { CorrectedPhrase } from "@/components/analysis/CorrectedPhrase";
import { ErrorList } from "@/components/analysis/ErrorList";
import { Separator } from "@/components/ui/separator";

const SCORE_CONFIG = {
  perfect: {
    icon: CheckCircle,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    label: "Отлично!",
  },
  good: {
    icon: AlertCircle,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    label: "Хорошо",
  },
  needs_work: {
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50 border-red-200",
    label: "Нужно доработать",
  },
} as const;

interface TranslationFeedbackProps {
  result: TranslationResult;
}

export function TranslationFeedback({ result }: TranslationFeedbackProps) {
  const score = SCORE_CONFIG[result.score];
  const ScoreIcon = score.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 bg-white border border-slate-200 rounded-2xl px-4 py-4 shadow-sm"
    >
      {/* Score badge */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${score.bg}`}>
        <ScoreIcon className={`w-4 h-4 shrink-0 ${score.color}`} />
        <span className={`text-sm font-semibold ${score.color}`}>{score.label}</span>
      </div>

      {/* Corrected translation */}
      <CorrectedPhrase corrected={result.corrected_translation} />

      {/* Native speaker note */}
      {result.colloquial && (
        <div className="border-l-2 border-orange-200 pl-3 flex items-start gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-orange-300 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-500 italic leading-snug">{result.colloquial}</p>
        </div>
      )}

      {/* Russian explanation */}
      {result.explanation_ru && (
        <p className="text-sm text-slate-600 leading-relaxed px-1">
          {result.explanation_ru}
        </p>
      )}

      {/* Error breakdown — no count heading */}
      {result.errors.length > 0 && (
        <>
          <Separator className="bg-slate-100" />
          <ErrorList errors={result.errors} />
        </>
      )}
    </motion.div>
  );
}
