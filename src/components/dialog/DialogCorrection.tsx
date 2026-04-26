"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { AnalysisResult } from "@/lib/types";

interface DialogCorrectionProps {
  originalText: string;
  analysis?: AnalysisResult;
}

export function DialogCorrection({ originalText, analysis }: DialogCorrectionProps) {
  // No analysis at all — just show the original on the left, empty right
  if (!analysis) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="mx-auto w-full max-w-6xl px-4"
      >
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <h4 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
            Du sagtest
          </h4>
          <p lang="de" className="text-sm leading-relaxed text-stone-800 whitespace-pre-wrap">
            {originalText}
          </p>
        </div>
      </motion.div>
    );
  }

  const hasErrors = analysis.errors.length > 0;
  const showNative =
    analysis.native_variant &&
    analysis.native_variant.trim().length > 0 &&
    analysis.native_variant.trim() !== analysis.corrected.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="mx-auto w-full max-w-6xl px-4"
    >
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm md:p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">

          {/* LEFT — original */}
          <div>
            <h4 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Du sagtest
            </h4>
            <p
              lang="de"
              className="text-sm leading-relaxed text-stone-700 whitespace-pre-wrap md:text-[15px]"
            >
              {originalText}
            </p>
          </div>

          {/* RIGHT — corrected (top) + native rephrase (bottom) */}
          <div className="flex flex-col gap-4 md:border-l md:border-stone-100 md:pl-6">

            {hasErrors ? (
              <section>
                <h4 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                  Korrigiert
                </h4>
                <p
                  lang="de"
                  className="text-sm font-medium leading-relaxed text-slate-900 md:text-[15px]"
                >
                  {analysis.corrected}
                </p>
              </section>
            ) : (
              <section>
                <h4 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                  Korrigiert
                </h4>
                <p className="text-xs text-emerald-700">✓ Alles korrekt</p>
              </section>
            )}

            {showNative && (
              <section className="border-t border-stone-100 pt-3">
                <h4 className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-orange-600">
                  <Sparkles className="h-3 w-3" />
                  Wie ein Muttersprachler
                </h4>
                <p
                  lang="de"
                  className="text-sm italic leading-relaxed text-stone-700 md:text-[15px]"
                >
                  {analysis.native_variant}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
