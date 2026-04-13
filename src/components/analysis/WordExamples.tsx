"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { WordExample } from "@/lib/types";
import { cn } from "@/lib/utils";

function WordItem({ item, index }: { item: WordExample; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 + index * 0.06 }}
      className="border border-white/5 rounded-lg overflow-hidden"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/3 transition-colors"
      >
        <span className="text-sm font-mono text-indigo-300">{item.word}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-zinc-500 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="px-3 pb-2.5 flex flex-col gap-1.5">
          {item.examples.map((ex, i) => (
            <p key={i} className="text-xs text-zinc-400 leading-relaxed">
              • {ex}
            </p>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function WordExamples({ examples }: { examples: WordExample[] }) {
  if (!examples.length) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium mb-1">
        Wortgebrauch
      </p>
      {examples.map((item, i) => (
        <WordItem key={item.word} item={item} index={i} />
      ))}
    </div>
  );
}
