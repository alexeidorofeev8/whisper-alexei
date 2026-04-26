"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { Difficulty, Scenario } from "@/lib/types";

const DIFFICULTY_LABEL: Record<Difficulty, { de: string; cls: string }> = {
  easy: { de: "leicht", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  medium: { de: "mittel", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  hard: { de: "schwer", cls: "bg-rose-50 text-rose-700 border-rose-200" },
};

interface ScenarioCardProps {
  scenario: Scenario;
}

export function ScenarioCard({ scenario }: ScenarioCardProps) {
  const [open, setOpen] = useState(true);
  const diff = DIFFICULTY_LABEL[scenario.difficulty];

  return (
    <div className="rounded-2xl border border-orange-100 bg-orange-50/40 px-4 py-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
          <p className="text-sm font-medium text-stone-800 truncate">
            {scenario.role}
          </p>
          <span
            className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${diff.cls}`}
          >
            {diff.de}
          </span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }}>
          <ChevronDown className="w-4 h-4 text-stone-400" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="mt-2 text-sm text-stone-600 leading-relaxed">
              {scenario.situation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
