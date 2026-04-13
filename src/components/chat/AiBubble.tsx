"use client";

import { motion } from "framer-motion";
import { Message } from "@/lib/types";

export function AiBubble({ message }: { message: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 px-4"
    >
      <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 text-xs font-bold shrink-0 mt-0.5">
        DE
      </div>
      <div className="max-w-[75%] bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <p className="text-slate-800 text-sm leading-relaxed">{message.aiText}</p>
      </div>
    </motion.div>
  );
}
