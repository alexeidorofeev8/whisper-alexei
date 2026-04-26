"use client";

import { motion } from "framer-motion";
import { Flame, Trophy, Star } from "lucide-react";

interface GameCardProps {
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  dailyPoints: { date: string; startMs: number; points: number }[];
}

const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

function tierLabel(points: number): { label: string; color: string } {
  if (points < 50) return { label: "Anfänger", color: "text-stone-500" };
  if (points < 200) return { label: "Lerner", color: "text-emerald-600" };
  if (points < 500) return { label: "Sprecher", color: "text-orange-600" };
  if (points < 1000) return { label: "Profi", color: "text-rose-600" };
  return { label: "Meister", color: "text-purple-600" };
}

export function GameCard({
  totalPoints,
  currentStreak,
  longestStreak,
  dailyPoints,
}: GameCardProps) {
  const tier = tierLabel(totalPoints);
  const maxDay = Math.max(...dailyPoints.map((d) => d.points), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-4 shadow-sm"
    >

      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-orange-700">
            <Star className="h-3.5 w-3.5" />
            Punkte
          </div>
          <div className="mt-0.5 text-3xl font-bold text-stone-800 tabular-nums">
            {totalPoints.toLocaleString("de-DE")}
          </div>
          <div className={`mt-0.5 text-xs font-medium ${tier.color}`}>{tier.label}</div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-1 rounded-full bg-white/80 border border-orange-200 px-2.5 py-1">
            <Flame className={`h-4 w-4 ${currentStreak > 0 ? "text-orange-500" : "text-stone-300"}`} />
            <span className="text-sm font-semibold text-stone-800 tabular-nums">{currentStreak}</span>
            <span className="text-[10px] text-stone-500">Streak</span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white/80 border border-stone-200 px-2.5 py-1 text-[11px] text-stone-600">
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            <span className="tabular-nums">Best: {longestStreak}</span>
          </div>
        </div>
      </div>

      {/* Daily points sparkline */}
      <div className="mt-4">
        <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-orange-700">
          Tägliche Punkte (letzte {dailyPoints.length} Tage)
        </p>
        <div className="flex h-16 items-end gap-1">
          {dailyPoints.map((d, i) => {
            const heightPct = d.points === 0 ? 4 : Math.max(8, (d.points / maxDay) * 100);
            const date = new Date(d.startMs);
            const weekday = WEEKDAYS[date.getDay()];
            const dayNum = date.getDate();
            return (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                <div className="relative flex w-full flex-1 items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ duration: 0.35, delay: i * 0.02 }}
                    className={`w-full rounded-t-md ${
                      d.points === 0
                        ? "bg-stone-100"
                        : d.points >= maxDay * 0.7
                        ? "bg-orange-400"
                        : "bg-orange-200"
                    }`}
                    title={`${d.date}: ${d.points} Punkte`}
                  />
                </div>
                <div className="flex flex-col items-center text-[8px] leading-none text-stone-400">
                  <span>{weekday}</span>
                  <span>{dayNum}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-3 text-[10px] leading-relaxed text-stone-500">
        Perfekte Nachricht (0 Fehler) = 10 Punkte + 5 pro Streak-Stufe. 1 Fehler = 3, 2 = 1, mehr = 0. Streak bleibt nur bei perfekten Nachrichten.
      </p>
    </motion.div>
  );
}
