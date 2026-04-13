"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

export function TypingIndicator() {
  const targetLanguage = useAppStore((s) => s.targetLanguage);
  const label = targetLanguage.toUpperCase();

  return (
    <div className="flex items-start gap-3 px-4">
      <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500 text-xs font-bold shrink-0">
        {label}
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 shadow-sm">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-orange-400"
            animate={{ scaleY: [1, 1.8, 1], opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
