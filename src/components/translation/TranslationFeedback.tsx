"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
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

      {/* Russian explanation */}
      {result.explanation_ru && (
        <p className="text-sm text-slate-600 leading-relaxed px-1">
          {result.explanation_ru}
        </p>
      )}

      {/* Error breakdown */}
      {result.errors.length > 0 && (
        <>
          <Separator className="bg-slate-100" />
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-2">
              Ошибки ({result.errors.length})
            </p>
            <ErrorList errors={result.errors} />
          </div>
        </>
      )}
    </motion.div>
  );
}
