"use client";

import { motion } from "framer-motion";
import { Sparkles, Lightbulb } from "lucide-react";
import { CorrectionResult } from "@/lib/types";
import { CopyButton } from "./CopyButton";

interface KorrekturFeedbackProps {
  result: CorrectionResult;
}

export function KorrekturFeedback({ result }: KorrekturFeedbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-4 rounded-2xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6"
    >

      {/* Korrigiert */}
      <section>
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Korrigiert
          </h3>
          <CopyButton text={result.corrected} />
        </div>
        <p
          lang="de"
          className="text-base sm:text-lg leading-relaxed text-slate-800 whitespace-pre-wrap"
        >
          {result.corrected}
        </p>
      </section>

      {/* Native variant */}
      {result.native_variant && result.native_variant.trim() && result.native_variant !== result.corrected && (
        <section className="border-t border-slate-100 pt-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-orange-400" />
              Wie ein Muttersprachler
            </h3>
            <CopyButton text={result.native_variant} label="Kopieren" />
          </div>
          <p lang="de" className="text-sm sm:text-base italic text-slate-600 leading-relaxed">
            {result.native_variant}
          </p>
        </section>
      )}

      {/* Hinweise */}
      {result.notes && result.notes.length > 0 && (
        <section className="border-t border-slate-100 pt-4">
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Hinweise
          </h3>
          <ul lang="de" className="flex flex-col gap-1.5 text-sm text-slate-700">
            {result.notes.map((note, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-orange-400 select-none">•</span>
                <span className="leading-snug">{note}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tip */}
      {result.tip && result.tip.trim() && (
        <section className="border-t border-slate-100 pt-4">
          <div className="flex items-start gap-2 text-sm text-slate-600">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p lang="de" className="leading-snug">
              {result.tip}
            </p>
          </div>
        </section>
      )}
    </motion.div>
  );
}
