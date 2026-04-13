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
      <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-bold shrink-0 mt-0.5">
        DE
      </div>
      <div className="max-w-[75%] bg-[#111218] border border-indigo-500/15 rounded-2xl rounded-tl-sm px-4 py-3">
        <p className="text-zinc-200 text-sm leading-relaxed">{message.aiText}</p>
      </div>
    </motion.div>
  );
}
