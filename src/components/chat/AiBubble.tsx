"use client";

import { motion } from "framer-motion";
import { Message } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";

export function AiBubble({ message }: { message: Message }) {
  const targetLanguage = useAppStore((s) => s.targetLanguage);
  const langLabel = targetLanguage.toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 px-4"
    >
      <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500 text-xs font-bold shrink-0 mt-0.5">
        {langLabel}
      </div>
      <div className="max-w-[75%] bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <p className="text-slate-800 text-sm leading-relaxed">{message.aiText}</p>
      </div>
    </motion.div>
  );
}
