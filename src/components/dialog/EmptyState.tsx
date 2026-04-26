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
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-orange-200 bg-orange-50 text-orange-500">
        <Sparkles className="h-6 w-6" />
      </div>
      <div className="max-w-md">
        <h2 className="text-lg font-semibold text-stone-800">
          Wähle ein Szenario und übe einen Dialog auf Deutsch.
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">
          Die KI spielt eine zufällige Rolle (Kollege, Bürgerbeamter, Nachbar...) und korrigiert deine Eingaben Schritt für Schritt.
        </p>
      </div>

      <button
        onClick={() => onCreate("hard")}
        disabled={isCreating}
        className="flex items-center gap-2 rounded-full bg-orange-100 px-5 py-2.5 text-sm font-semibold text-orange-800 hover:bg-orange-200 disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm"
      >
        <Plus className="h-4 w-4" />
        Neuer Chat (schwer)
      </button>

      {!isCreating && (
        <div className="flex items-center gap-3 text-xs text-stone-400">
          <button
            onClick={() => onCreate("easy")}
            className="hover:text-orange-600 hover:underline transition-colors"
          >
            leicht
          </button>
          <span className="text-stone-300">·</span>
          <button
            onClick={() => onCreate("medium")}
            className="hover:text-orange-600 hover:underline transition-colors"
          >
            mittel
          </button>
        </div>
      )}
    </motion.div>
  );
}
