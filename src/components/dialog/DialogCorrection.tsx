"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { AnalysisResult, GrammarError } from "@/lib/types";

interface DialogCorrectionProps {
  originalText: string;
  analysis?: AnalysisResult;
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

interface ErrorTokenProps {
  token: string;
  error: GrammarError;
}

function ErrorToken({ token, error }: ErrorTokenProps) {
  const [hover, setHover] = useState(false);
  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onTouchStart={() => setHover((v) => !v)}
    >
      <span className="cursor-help rounded-sm bg-amber-50/80 px-0.5 ring-1 ring-amber-100">
        {token}
      </span>
      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 w-max max-w-[240px] -translate-x-1/2 rounded-lg border border-amber-200 bg-amber-100 px-2.5 py-1.5 text-xs leading-snug text-amber-900 shadow-md"
            role="tooltip"
          >
            {renderBold(error.rule_name || "Fehler")}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function HighlightedOriginal({
  tokens,
  errors,
  fallbackText,
}: {
  tokens: string[];
  errors: GrammarError[];
  fallbackText: string;
}) {
  if (!tokens || tokens.length === 0) {
    return (
      <p lang="de" className="text-sm leading-relaxed text-stone-700 whitespace-pre-wrap">
        {fallbackText}
      </p>
    );
  }

  const indexToError = new Map<number, GrammarError>();
  for (const e of errors) {
    for (const idx of e.original_indices) {
      if (!indexToError.has(idx)) indexToError.set(idx, e);
    }
  }

  return (
    <p lang="de" className="text-sm leading-relaxed text-stone-700">
      {tokens.map((tok, i) => {
        const error = indexToError.get(i);
        const isPunct = /^[.,!?;:]/.test(tok);
        const space = !isPunct && i > 0 ? " " : "";
        return (
          <span key={i}>
            {space}
            {error ? <ErrorToken token={tok} error={error} /> : tok}
          </span>
        );
      })}
    </p>
  );
}

export function DialogCorrection({ originalText, analysis }: DialogCorrectionProps) {
  // No analysis at all — just original on left
  if (!analysis) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="mx-auto w-full max-w-5xl px-4"
      >
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <h4 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
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
  const nativeText = analysis.native_variant?.trim();
  const showNative =
    nativeText && nativeText.length > 0 && nativeText !== analysis.corrected.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="mx-auto w-full max-w-5xl px-4"
    >
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div
          className={`grid grid-cols-1 gap-4 md:gap-5 ${
            showNative ? "md:grid-cols-3" : "md:grid-cols-2"
          }`}
        >

          {/* LEFT — original with pale-yellow error highlights */}
          <div>
            <h4 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Du sagtest
            </h4>
            <HighlightedOriginal
              tokens={analysis.original_tokens}
              errors={analysis.errors}
              fallbackText={originalText}
            />
          </div>

          {/* MIDDLE — grammatically corrected, close to user's original wording */}
          <div className="md:border-l md:border-stone-100 md:pl-5">
            <h4 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
              Korrigiert
            </h4>
            {hasErrors ? (
              <p lang="de" className="text-sm font-medium leading-relaxed text-slate-900">
                {analysis.corrected}
              </p>
            ) : (
              <p className="text-xs text-emerald-700">✓ Alles korrekt</p>
            )}
          </div>

          {/* RIGHT — full native rephrase (only when meaningfully different) */}
          {showNative && (
            <div className="md:border-l md:border-stone-100 md:pl-5">
              <h4 className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-orange-600">
                <Sparkles className="h-3 w-3" />
                Wie ein Muttersprachler
              </h4>
              <p lang="de" className="text-sm italic leading-relaxed text-stone-700">
                {nativeText}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
