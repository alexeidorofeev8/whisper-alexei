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

export function AnalysisBubble({ message }: { message: Message }) {
  const { analysis } = message;
  if (!analysis) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 px-4"
    >
      <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-bold shrink-0 mt-0.5">
        DE
      </div>
      <div className="flex-1 bg-[#111218] border border-white/6 rounded-2xl rounded-tl-sm px-4 py-4 flex flex-col gap-4 min-w-0">
        {/* Token rows with animations */}
        <TokenRow analysis={analysis} messageId={message.id} />

        <Separator className="bg-white/5" />

        {/* Corrected full sentence */}
        <CorrectedPhrase corrected={analysis.corrected} />

        {/* Error explanations */}
        {analysis.errors.length > 0 && (
          <>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium mb-2">
                Fehler ({analysis.errors.length})
              </p>
              <ErrorList errors={analysis.errors} />
            </div>
            <Separator className="bg-white/5" />
          </>
        )}

        {/* Native phrasings */}
        {analysis.alternatives.length > 0 && (
          <AlternativesList alternatives={analysis.alternatives} />
        )}

        {/* Word usage examples */}
        {analysis.word_examples.length > 0 && (
          <WordExamples examples={analysis.word_examples} />
        )}

        {/* Study tip */}
        <StudyTip tip={analysis.study_tip} level={analysis.level_assessment} />
      </div>
    </motion.div>
  );
}
