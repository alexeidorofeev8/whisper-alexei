"use client";

import { motion } from "framer-motion";
import { GrammarError } from "@/lib/types";
import { ErrorCard } from "./ErrorCard";
import { CheckCircle } from "lucide-react";

export function ErrorList({ errors }: { errors: GrammarError[] }) {
  if (errors.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2 text-emerald-400 text-sm"
      >
        <CheckCircle className="w-4 h-4" />
        <span>Keine Fehler gefunden! Ausgezeichnet!</span>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {errors.map((error, i) => (
        <ErrorCard key={error.id} error={error} index={i} />
      ))}
    </div>
  );
}
