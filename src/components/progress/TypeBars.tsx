"use client";

import { motion } from "framer-motion";
import { ErrorType } from "@/lib/types";
import { typeLabelDe } from "@/lib/analytics";

interface TypeBarsProps {
  byType: { type: ErrorType; count: number }[];
  total: number;
}

export function TypeBars({ byType, total }: TypeBarsProps) {
  if (byType.length === 0 || total === 0) {
    return (
      <p className="py-2 text-sm text-stone-400">Noch keine Fehlertypen erfasst.</p>
    );
  }

  const max = byType[0].count;

  return (
    <ul className="flex flex-col gap-2">
      {byType.map((b, i) => {
        const pct = max > 0 ? (b.count / max) * 100 : 0;
        return (
          <li key={b.type} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-xs font-medium text-stone-700">
              {typeLabelDe(b.type)}
            </span>
            <div className="relative flex-1 h-6 rounded-md bg-stone-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.4, delay: i * 0.04, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 rounded-md bg-orange-200"
              />
              <span className="absolute inset-y-0 right-2 flex items-center text-[11px] font-medium text-stone-700">
                {b.count}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
