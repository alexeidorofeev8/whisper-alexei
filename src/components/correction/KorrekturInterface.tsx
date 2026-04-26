"use client";

import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useCorrection } from "@/hooks/useCorrection";
import { InputBar } from "@/components/voice/InputBar";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { KorrekturFeedback } from "./KorrekturFeedback";

export function KorrekturInterface() {
  const isAnalyzing = useAppStore((s) => s.isAnalyzing);
  const { result, error, lastInput, correct, reset } = useCorrection();

  return (
    <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-5 px-4">

      {/* Intro / hint when nothing yet */}
      {!result && !isAnalyzing && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-6 text-sm text-slate-500 max-w-md mx-auto"
        >
          <p className="mb-1">Diktiere oder schreibe deinen deutschen Text.</p>
          <p>Du bekommst eine korrigierte Version, eine natürliche Variante und kurze Hinweise auf Deutsch.</p>
        </motion.div>
      )}

      {/* User echo (the input that was sent) */}
      {lastInput && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end"
        >
          <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-orange-50 border border-orange-100 px-4 py-2.5 text-sm text-slate-700 whitespace-pre-wrap">
            {lastInput}
          </div>
        </motion.div>
      )}

      {/* Loading */}
      {isAnalyzing && <TypingIndicator />}

      {/* Result */}
      <AnimatePresence>
        {result && !isAnalyzing && (
          <KorrekturFeedback result={result} />
        )}
      </AnimatePresence>

      {/* Error */}
      {error && !isAnalyzing && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-medium mb-1">Fehler</p>
          <p className="text-xs leading-relaxed text-red-600">{error}</p>
        </div>
      )}

      {/* Reset button when there's a result */}
      {result && !isAnalyzing && (
        <div className="flex justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Neu / Заново
          </button>
        </div>
      )}

      {/* Sticky bottom input */}
      <div className="border-t border-slate-200 bg-white/90 backdrop-blur-xl -mx-4 px-4 mt-auto sticky bottom-0">
        <InputBar
          onSubmit={correct}
          placeholder="Deutschen Text einfügen oder diktieren…"
        />
      </div>
    </div>
  );
}
