"use client";

import { useRef } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { AnalysisResult, GrammarError } from "@/lib/types";
import { AnimatedToken } from "./AnimatedToken";
import { WordOrderArrows } from "./WordOrderArrows";

function buildErrorMap(errors: GrammarError[]): Map<number, GrammarError> {
  const map = new Map<number, GrammarError>();
  for (const err of errors) {
    for (const idx of err.original_indices) {
      map.set(idx, err);
    }
  }
  return map;
}

function buildCorrectedErrorMap(errors: GrammarError[]): Map<number, GrammarError> {
  const map = new Map<number, GrammarError>();
  for (const err of errors) {
    if (err.type === "word_order" && err.correct_indices) {
      for (const idx of err.correct_indices) {
        map.set(idx, err);
      }
    }
  }
  return map;
}

export function TokenRow({
  analysis,
  messageId,
}: {
  analysis: AnalysisResult;
  messageId: string;
}) {
  const { original_tokens, corrected, errors } = analysis;
  const wordOrderErrors = errors.filter((e) => e.type === "word_order");
  const hasWordOrder = wordOrderErrors.length > 0;

  const origErrorMap = buildErrorMap(errors);

  const correctedTokens = corrected
    .split(/(\s+)/)
    .filter((t) => t.trim().length > 0);

  const correctedErrorMap = buildCorrectedErrorMap(errors);

  const containerRef = useRef<HTMLDivElement>(null);
  const tokenRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const correctedTokenRefs = useRef<(HTMLSpanElement | null)[]>([]);

  return (
    <div className="flex flex-col gap-3">
      <LayoutGroup id={`tokens-${messageId}`}>
        {/* Row 1: Original */}
        <div ref={containerRef} className="relative">
          <p className="text-xs text-zinc-600 mb-1.5 uppercase tracking-wide">
            Deine Aussage
          </p>
          <div className="flex flex-wrap gap-1.5 min-h-[2rem]">
            {original_tokens.map((token, i) => {
              const error = origErrorMap.get(i);
              return (
                <span
                  key={i}
                  ref={(el) => { tokenRefs.current[i] = el; }}
                >
                  <AnimatedToken
                    token={token}
                    index={i}
                    error={error}
                    layoutId={
                      error?.type === "word_order"
                        ? `tok-${messageId}-${i}`
                        : undefined
                    }
                  />
                </span>
              );
            })}
          </div>

          {hasWordOrder && (
            <WordOrderArrows
              errors={wordOrderErrors}
              tokenRefs={tokenRefs}
              correctedTokenRefs={correctedTokenRefs}
              containerRef={containerRef}
            />
          )}
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="h-px bg-white/5 origin-left"
        />

        {/* Row 2: Corrected tokens */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-xs text-zinc-600 mb-1.5 uppercase tracking-wide">
            Korrigiert
          </p>
          <div className="flex flex-wrap gap-1.5 min-h-[2rem]">
            {correctedTokens.map((token, i) => {
              const error = correctedErrorMap.get(i);
              return (
                <span
                  key={i}
                  ref={(el) => { correctedTokenRefs.current[i] = el; }}
                >
                  <AnimatedToken
                    token={token}
                    index={i}
                    error={error}
                    delay={0.8}
                    layoutId={
                      error?.type === "word_order" && error.original_indices[0] !== undefined
                        ? `tok-${messageId}-${error.original_indices[0]}`
                        : undefined
                    }
                  />
                </span>
              );
            })}
          </div>
        </motion.div>
      </LayoutGroup>
    </div>
  );
}
