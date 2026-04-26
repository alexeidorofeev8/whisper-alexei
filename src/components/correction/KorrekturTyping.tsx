"use client";

import { motion } from "framer-motion";

/** Neutral pulsing-dots indicator without any language label. */
export function KorrekturTyping() {
  return (
    <div className="flex items-center justify-center py-6">
      <div className="bg-white border border-slate-200 rounded-full px-5 py-3 flex items-center gap-1.5 shadow-sm">
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
