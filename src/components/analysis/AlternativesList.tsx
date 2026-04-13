"use client";

import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

function AlternativeItem({ text, index }: { text: string; index: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 + index * 0.06 }}
      className="group flex items-center justify-between gap-3 px-3 py-2 bg-zinc-800/60 border border-white/5 rounded-lg hover:border-white/10 transition-colors"
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs text-zinc-600 font-mono shrink-0">{index + 1}.</span>
        <p className="text-sm text-zinc-200 truncate">{text}</p>
      </div>
      <button
        onClick={handleCopy}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-zinc-300 shrink-0"
        aria-label="Kopieren"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </motion.div>
  );
}

export function AlternativesList({ alternatives }: { alternatives: string[] }) {
  if (!alternatives.length) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium mb-1">
        Alternativen
      </p>
      {alternatives.map((alt, i) => (
        <AlternativeItem key={i} text={alt} index={i} />
      ))}
    </div>
  );
}
