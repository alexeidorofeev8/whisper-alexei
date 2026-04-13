"use client";

import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";

function AlternativeItem({ text, index }: { text: string; index: number }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 + index * 0.06 }}
      onClick={() => setExpanded((v) => !v)}
      className="group flex items-start justify-between gap-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors cursor-pointer"
    >
      <div className="flex items-start gap-2 min-w-0">
        <span className="text-xs text-slate-400 font-mono shrink-0 mt-0.5">{index + 1}.</span>
        <p className={`text-sm text-slate-700 ${expanded ? "" : "truncate"}`}>{text}</p>
      </div>
      <button
        onClick={handleCopy}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600 shrink-0 mt-0.5"
        aria-label="Copy"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-orange-500" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </motion.div>
  );
}

export function AlternativesList({ alternatives }: { alternatives: string[] }) {
  const targetLanguage = useAppStore((s) => s.targetLanguage);
  if (!alternatives.length) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">
        {targetLanguage === "en" ? "Alternatives" : "Alternativen"}
      </p>
      {alternatives.map((alt, i) => (
        <AlternativeItem key={i} text={alt} index={i} />
      ))}
    </div>
  );
}
