"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";
import { useDialogStore } from "@/store/useDialogStore";
import { aggregateErrorStats } from "@/lib/analytics";

/**
 * Tiny streak indicator shown in the Dialog header.
 * Reads stats from the dialog store on every render — recomputes are cheap
 * and Zustand notifies us on chat updates so the badge stays live during play.
 */
export function StreakBadge() {
  const chats = useDialogStore((s) => s.chats);
  const { currentStreak, totalPoints } = useMemo(
    () => aggregateErrorStats(chats, 1),
    [chats]
  );

  if (totalPoints === 0) return null;

  return (
    <div className="flex items-center gap-1.5">
      <AnimatePresence>
        {currentStreak > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-xs"
          >
            <Flame className="h-3.5 w-3.5 text-orange-500" />
            <span className="font-semibold text-orange-700 tabular-nums">{currentStreak}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <span className="text-[11px] tabular-nums text-stone-500">{totalPoints} Pkt</span>
    </div>
  );
}
