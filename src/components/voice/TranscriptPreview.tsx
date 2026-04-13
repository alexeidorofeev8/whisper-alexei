"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

export function TranscriptPreview() {
  const interimTranscript = useAppStore((s) => s.interimTranscript);

  return (
    <AnimatePresence>
      {interimTranscript && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="text-sm text-zinc-400 italic text-center px-4 max-w-md truncate"
        >
          {interimTranscript}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
