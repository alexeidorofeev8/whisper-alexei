"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

export function TranscriptPreview() {
  const interimTranscript = useAppStore((s) => s.interimTranscript);

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
            {interimTranscript}
            <span className="inline-block w-[2px] h-[0.85em] bg-orange-400 ml-[3px] align-text-bottom rounded-sm animate-pulse" />
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
