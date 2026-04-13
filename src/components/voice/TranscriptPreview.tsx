"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { useAppStore } from "@/store/useAppStore";

interface WordEntry {
  text: string;
  id: number;
  isNew: boolean;
}

function reconcileWords(
  currentWords: string[],
  prev: WordEntry[],
  counter: { n: number }
): WordEntry[] {
  // How many leading words are stable:
  // match prev AND aren't the last current word (which may still be interim/changing)
  let stableCount = 0;
  while (
    stableCount < prev.length &&
    stableCount < currentWords.length - 1 &&
    prev[stableCount].text === currentWords[stableCount]
  ) {
    stableCount++;
  }

  const result: WordEntry[] = prev
    .slice(0, stableCount)
    .map((w) => ({ ...w, isNew: false }));

  for (let i = stableCount; i < currentWords.length; i++) {
    const existing = prev[i];
    if (existing && existing.text === currentWords[i]) {
      result.push({ ...existing, isNew: false });
    } else {
      result.push({ text: currentWords[i], id: counter.n++, isNew: true });
    }
  }

  return result;
}

export function TranscriptPreview() {
  const interimTranscript = useAppStore((s) => s.interimTranscript);
  const prevWordsRef = useRef<WordEntry[]>([]);
  const counterRef = useRef({ n: 0 });

  let renderedWords: WordEntry[];

  if (!interimTranscript) {
    prevWordsRef.current = [];
    renderedWords = [];
  } else {
    const currentWords = interimTranscript.trim().split(/\s+/).filter(Boolean);
    renderedWords = reconcileWords(currentWords, prevWordsRef.current, counterRef.current);
    prevWordsRef.current = renderedWords.map((w) => ({ ...w, isNew: false }));
  }

  return (
    <AnimatePresence>
      {interimTranscript && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3"
        >
          <p className="text-sm text-slate-700 leading-relaxed break-words">
            {renderedWords.map((entry, i) => (
              <motion.span
                key={entry.id}
                initial={entry.isNew ? { opacity: 0, y: 4 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
              >
                {i > 0 ? " " : ""}
                {entry.text}
              </motion.span>
            ))}
            <span className="inline-block w-[2px] h-[0.85em] bg-orange-400 ml-[3px] align-text-bottom rounded-sm animate-pulse" />
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
