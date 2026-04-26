"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnalysisResult, AlignedPair } from "@/lib/types";

interface DialogCorrectionProps {
  analysis: AnalysisResult;
}

interface PhraseProps {
  pair: AlignedPair;
  trailingSpace: boolean;
}

function Phrase({ pair, trailingSpace }: PhraseProps) {
  const [hovered, setHovered] = useState(false);
  const same = pair.left.trim() === pair.right.trim();

  if (same) {
    return (
      <span lang="de" className="text-slate-800">
        {pair.right}
        {trailingSpace ? " " : ""}
      </span>
    );
  }

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered((v) => !v)}
    >
      <span
        lang="de"
        className="cursor-help rounded-md bg-emerald-50 px-1 py-0.5 font-medium text-emerald-900 underline decoration-emerald-300 decoration-dotted underline-offset-4"
      >
        {pair.right}
      </span>
      {trailingSpace ? " " : ""}

      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 -translate-x-1/2 whitespace-nowrap rounded-lg border border-amber-200 bg-amber-100 px-2.5 py-1 text-xs text-amber-900 shadow-md"
            role="tooltip"
          >
            <span className="mr-1 font-semibold uppercase tracking-wide text-[9px] text-amber-700">
              du:
            </span>
            <span lang="de">{pair.left}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export function DialogCorrection({ analysis }: DialogCorrectionProps) {
  const hasErrors = analysis.errors.length > 0;

  if (!hasErrors) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mx-4 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-2 text-xs text-emerald-700"
      >
        ✓ Alles korrekt
      </motion.div>
    );
  }

  const aligned = analysis.aligned ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mx-4 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm"
    >
      {aligned.length > 0 ? (
        <p lang="de" className="text-sm leading-loose">
          {aligned.map((pair, i) => (
            <Phrase
              key={i}
              pair={pair}
              trailingSpace={i < aligned.length - 1}
            />
          ))}
        </p>
      ) : (
        <p lang="de" className="text-sm font-medium leading-relaxed text-slate-900">
          {analysis.corrected}
        </p>
      )}
    </motion.div>
  );
}
