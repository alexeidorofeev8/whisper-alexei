"use client";

import { motion } from "framer-motion";
import { Message } from "@/lib/types";
import { TokenRow } from "@/components/analysis/TokenRow";
import { CorrectedPhrase } from "@/components/analysis/CorrectedPhrase";
import { ErrorList } from "@/components/analysis/ErrorList";
import { AlternativesList } from "@/components/analysis/AlternativesList";
import { WordExamples } from "@/components/analysis/WordExamples";
import { StudyTip } from "@/components/analysis/StudyTip";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store/useAppStore";

export function AnalysisBubble({ message }: { message: Message }) {
  const { analysis } = message;
  const targetLanguage = useAppStore((s) => s.targetLanguage);
  const langLabel = targetLanguage.toUpperCase();

  if (!analysis) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 px-4"
    >
      <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500 text-xs font-bold shrink-0 mt-0.5">
        {langLabel}
      </div>
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-4 flex flex-col gap-4 min-w-0 shadow-sm">
        <TokenRow analysis={analysis} messageId={message.id} />

        <Separator className="bg-slate-100" />

        <CorrectedPhrase corrected={analysis.corrected} />

        {analysis.errors.length > 0 && (
          <>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-2">
                {targetLanguage === "en" ? "Errors" : "Fehler"} ({analysis.errors.length})
              </p>
              <ErrorList errors={analysis.errors} />
            </div>
            <Separator className="bg-slate-100" />
          </>
        )}

        {analysis.alternatives.length > 0 && (
          <AlternativesList alternatives={analysis.alternatives} />
        )}

        {analysis.word_examples.length > 0 && (
          <WordExamples examples={analysis.word_examples} />
        )}

        <StudyTip tip={analysis.study_tip} level={analysis.level_assessment} />
      </div>
    </motion.div>
  );
}
