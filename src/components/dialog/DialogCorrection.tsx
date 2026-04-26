"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageCircle } from "lucide-react";
import { AnalysisResult, GrammarError } from "@/lib/types";

interface DialogCorrectionProps {
  originalText: string;
  analysis?: AnalysisResult;
  /** AI's in-role reply that follows this user turn (rendered in the right column). */
  assistantText?: string;
  assistantRole?: string;
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
            className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 w-max max-w-[260px] -translate-x-1/2 rounded-lg border border-amber-200 bg-amber-100 px-2.5 py-1.5 text-xs leading-snug text-amber-900 shadow-md"
            role="tooltip"
          >
            {renderBold(error.rule_name || "Fehler")}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/** Build a render of original_tokens with pale-yellow highlights on error tokens. */
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
      <p lang="de" className="text-sm leading-relaxed text-stone-700 whitespace-pre-wrap md:text-[15px]">
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
    <p lang="de" className="text-sm leading-relaxed text-stone-700 md:text-[15px]">
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

export function DialogCorrection({
  originalText,
  analysis,
  assistantText,
  assistantRole,
}: DialogCorrectionProps) {
  // No analysis at all — just original on left, nothing on right
  if (!analysis) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="mx-auto w-full max-w-6xl px-4"
      >
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm md:p-5">
          <h4 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
            Du sagtest
          </h4>
          <p lang="de" className="text-sm leading-relaxed text-stone-800 whitespace-pre-wrap md:text-[15px]">
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

          {/* RIGHT — corrected + native variant + AI reply */}
          <div className="flex flex-col gap-4 md:border-l md:border-stone-100 md:pl-6">

            <section>
              <h4 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                Korrigiert
              </h4>
              {hasErrors ? (
                <p lang="de" className="text-sm font-medium leading-relaxed text-slate-900 md:text-[15px]">
                  {analysis.corrected}
                </p>
              ) : (
                <p className="text-xs text-emerald-700">✓ Alles korrekt</p>
              )}
            </section>

            {showNative && (
              <section className="border-t border-stone-100 pt-3">
                <h4 className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-orange-600">
                  <Sparkles className="h-3 w-3" />
                  Wie ein Muttersprachler
                </h4>
                <p lang="de" className="text-sm italic leading-relaxed text-stone-700 md:text-[15px]">
                  {analysis.native_variant}
                </p>
              </section>
            )}

            {assistantText && (
              <section className="border-t border-stone-100 pt-3">
                <h4 className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                  <MessageCircle className="h-3 w-3" />
                  {assistantRole ?? "Antwort"}
                </h4>
                <p lang="de" className="text-sm leading-relaxed text-slate-800 whitespace-pre-wrap md:text-[15px]">
                  {assistantText}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
