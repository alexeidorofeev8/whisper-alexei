"use client";

import { motion } from "framer-motion";
import { AnalysisResult } from "@/lib/types";
import { CopyButton } from "@/components/correction/CopyButton";

interface DialogCorrectionProps {
  analysis: AnalysisResult;
}

/** Render a string with **bold** markdown segments. */
function renderBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.length > 4 && part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
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

  const bullets = analysis.errors.slice(0, 3).map((e) => e.rule_name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mx-4 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm"
    >
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
          Korrigiert
        </h4>
        <CopyButton text={analysis.corrected} />
      </div>
      <p lang="de" className="mb-2.5 text-sm leading-relaxed text-slate-800">
        {analysis.corrected}
      </p>

      <ul lang="de" className="flex flex-col gap-1 text-xs text-slate-600">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-1.5 leading-snug">
            <span className="text-orange-400 select-none">•</span>
            <span>{renderBold(b)}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
