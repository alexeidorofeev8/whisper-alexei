"use client";

import { motion } from "framer-motion";
import { DailyBucket } from "@/lib/analytics";

interface DailyTrendProps {
  byDay: DailyBucket[];
}

const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

export function DailyTrend({ byDay }: DailyTrendProps) {
  const maxRate = Math.max(...byDay.map((d) => d.errorRate), 0.0001);

  return (
    <div>
      <p className="mb-2 text-[11px] text-stone-400">Letzte {byDay.length} Tage · Fehler pro Nachricht</p>
      <div className="flex items-end gap-1.5 h-24">
        {byDay.map((d, i) => {
          const heightPct = d.turns === 0 ? 4 : Math.max(8, (d.errorRate / maxRate) * 100);
          const dim = d.turns === 0;
          const date = new Date(d.startMs);
          const weekday = WEEKDAYS[date.getDay()];
          const dayNum = date.getDate();
          return (
            <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
              <div className="relative flex-1 w-full flex items-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 0.35, delay: i * 0.02 }}
                  className={`w-full rounded-t-md ${
                    dim ? "bg-stone-100" : d.errorRate > 1.5 ? "bg-rose-300" : d.errorRate > 0.5 ? "bg-orange-300" : "bg-emerald-300"
                  }`}
                  title={`${d.date}: ${d.turns} turns, ${d.errors} errors (${d.errorRate.toFixed(2)}/turn)`}
                />
              </div>
              <div className="flex flex-col items-center text-[9px] leading-none text-stone-400">
                <span>{weekday}</span>
                <span>{dayNum}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
