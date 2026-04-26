"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Loader2, Lightbulb } from "lucide-react";
import { FehlerberichtResult } from "@/lib/types";

interface FehlerberichtProps {
  topRules: string[];
  totalUserTurns: number;
}

function renderBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.length > 4 && part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function Fehlerbericht({ topRules, totalUserTurns }: FehlerberichtProps) {
  const [result, setResult] = useState<FehlerberichtResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/fehlerbericht", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules: topRules.slice(0, 5) }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || body.error || `HTTP ${res.status}`);
      }
      const data: FehlerberichtResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (totalUserTurns < 3 || topRules.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-xs text-stone-500">
        Schreibe noch ein paar Nachrichten — dann kann der KI-Sprachlehrer einen persönlichen Fehlerbericht für dich erstellen.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-2">
        <h2 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500">
          <BookOpen className="h-3.5 w-3.5" />
          Mein Fehlerbericht
        </h2>
        <button
          onClick={generate}
          disabled={isLoading}
          className="flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1.5 text-xs font-semibold text-orange-800 hover:bg-orange-200 disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Analysiere…
            </>
          ) : result ? (
            "Neu erstellen"
          ) : (
            "KI-Tipps holen"
          )}
        </button>
      </div>

      {!result && !isLoading && !error && (
        <p className="text-sm text-stone-500">
          Bekomme einen kurzen, persönlichen Lerntipp zu deinen häufigsten Fehlern (auf Deutsch).
        </p>
      )}

      {error && (
        <p className="rounded-xl bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-700">
          Fehler: {error}
        </p>
      )}

      <AnimatePresence>
        {result && (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex flex-col gap-3"
          >
            {result.items.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-stone-100 bg-stone-50/50 p-3"
              >
                <h3 lang="de" className="mb-1 text-sm font-semibold text-stone-800">
                  {renderBold(item.title)}
                </h3>
                <p lang="de" className="mb-2 text-[13px] leading-relaxed text-stone-700">
                  {renderBold(item.explanation)}
                </p>

                {item.examples.length > 0 && (
                  <ul lang="de" className="mb-2 flex flex-col gap-0.5 text-[13px] text-stone-600">
                    {item.examples.map((ex, j) => (
                      <li key={j} className="flex gap-1.5">
                        <span className="text-emerald-500 select-none">✓</span>
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {item.tip && (
                  <div className="mt-2 flex gap-1.5 rounded-lg bg-amber-50 border border-amber-100 px-2.5 py-1.5 text-xs text-amber-900">
                    <Lightbulb className="h-3.5 w-3.5 shrink-0 text-amber-500 mt-0.5" />
                    <span lang="de" className="leading-snug">{renderBold(item.tip)}</span>
                  </div>
                )}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
