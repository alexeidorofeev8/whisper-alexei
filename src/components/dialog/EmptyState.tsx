"use client";

import { motion } from "framer-motion";
import { Sparkles, Plus } from "lucide-react";
import { Difficulty } from "@/lib/types";

interface EmptyStateProps {
  isCreating: boolean;
  onCreate: (difficulty: Difficulty) => void;
}

export function EmptyState({ isCreating, onCreate }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-10 text-center"
    >
      <div className="flex w-14 h-14 items-center justify-center rounded-full bg-orange-50 border border-orange-200 text-orange-500">
        <Sparkles className="w-6 h-6" />
      </div>
      <div className="max-w-md">
        <h2 className="text-lg font-semibold text-stone-800">
          Wähle ein Szenario und übe einen Dialog auf Deutsch.
        </h2>
        <p className="mt-2 text-sm text-stone-500 leading-relaxed">
          Die KI spielt eine zufällige Rolle (Kollege, Bürgerbeamter, Nachbar...) und korrigiert deine Eingaben Schritt für Schritt.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
          <button
            key={d}
            disabled={isCreating}
            onClick={() => onCreate(d)}
            className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            {d === "easy" ? "leicht" : d === "medium" ? "mittel" : "schwer"}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
