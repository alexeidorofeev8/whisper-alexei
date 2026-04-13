"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export function CorrectedPhrase({ corrected }: { corrected: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="flex items-start gap-2 px-3 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl"
    >
      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
      <p className="text-emerald-800 text-sm font-medium leading-relaxed">
        {corrected}
      </p>
    </motion.div>
  );
}
