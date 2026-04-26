"use client";

import { useMemo, useState } from "react";
import { DayStat } from "@/lib/analytics";

interface HeatmapProps {
  days: DayStat[];
}

const LEVEL_CLASSES = [
  "bg-stone-100",
  "bg-orange-100",
  "bg-orange-200",
  "bg-orange-300",
  "bg-orange-500",
];

function pointsLevel(points: number): number {
  if (points === 0) return 0;
  if (points <= 20) return 1;
  if (points <= 50) return 2;
  if (points <= 100) return 3;
  return 4;
}

const DE_DATE_FMT = new Intl.DateTimeFormat("de-DE", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

const MONTH_FMT = new Intl.DateTimeFormat("de-DE", { month: "short" });

interface HoverInfo {
  stat: DayStat;
  x: number;
  y: number;
}

export function Heatmap({ days }: HeatmapProps) {
  const [hover, setHover] = useState<HoverInfo | null>(null);

  // Build month labels (one per first column of each month, approximately)
  const monthLabels = useMemo(() => {
    const labels: { weekIndex: number; label: string }[] = [];
    let lastMonth = -1;
    for (let i = 0; i < days.length; i += 7) {
      const date = new Date(days[i].startMs);
      const month = date.getMonth();
      if (month !== lastMonth) {
        labels.push({ weekIndex: Math.floor(i / 7), label: MONTH_FMT.format(date) });
        lastMonth = month;
      }
    }
    return labels;
  }, [days]);

  const totalDays = days.filter((d) => d.turns > 0).length;
  const totalTurns = days.reduce((sum, d) => sum + d.turns, 0);

  return (
    <div className="relative">

      {/* Container with horizontal scroll on small screens */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-block">

          {/* Month row */}
          <div
            className="grid mb-1.5 text-[9px] text-stone-400 select-none"
            style={{
              gridTemplateColumns: `repeat(${days.length / 7}, 13px)`,
              gap: "3px",
            }}
          >
            {Array.from({ length: days.length / 7 }).map((_, weekIdx) => {
              const label = monthLabels.find((m) => m.weekIndex === weekIdx);
              return (
                <span key={weekIdx} className="whitespace-nowrap leading-none">
                  {label?.label ?? ""}
                </span>
              );
            })}
          </div>

          {/* Cells: 7 rows × N weeks, fills column-by-column */}
          <div
            className="grid"
            style={{
              gridTemplateRows: "repeat(7, 13px)",
              gridAutoFlow: "column",
              gridAutoColumns: "13px",
              gap: "3px",
            }}
          >
            {days.map((d) => {
              const level = pointsLevel(d.points);
              return (
                <div
                  key={d.date}
                  className={`rounded-[3px] cursor-pointer transition-shadow ${LEVEL_CLASSES[level]} hover:ring-2 hover:ring-orange-400`}
                  onMouseEnter={(e) =>
                    setHover({ stat: d, x: e.clientX, y: e.clientY })
                  }
                  onMouseMove={(e) =>
                    setHover((prev) =>
                      prev ? { ...prev, x: e.clientX, y: e.clientY } : prev
                    )
                  }
                  onMouseLeave={() => setHover(null)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend + summary */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] text-stone-500">
        <span>
          {totalDays} aktive Tage · {totalTurns} Nachrichten insgesamt
        </span>
        <div className="flex items-center gap-1">
          <span>weniger</span>
          {LEVEL_CLASSES.map((cls, i) => (
            <span key={i} className={`block h-2.5 w-2.5 rounded-[3px] ${cls}`} />
          ))}
          <span>mehr</span>
        </div>
      </div>

      {/* Floating tooltip — yellow background, follows mouse */}
      {hover && (
        <div
          className="pointer-events-none fixed z-30 rounded-lg border border-amber-200 bg-amber-100 px-2.5 py-1.5 text-xs text-amber-900 shadow-md"
          style={{
            left: hover.x + 12,
            top: hover.y - 12,
            maxWidth: 220,
          }}
          role="tooltip"
        >
          <div className="font-semibold">
            {DE_DATE_FMT.format(new Date(hover.stat.startMs))}
          </div>
          {hover.stat.turns === 0 ? (
            <div className="text-amber-700/70">keine Aktivität</div>
          ) : (
            <ul className="mt-0.5 flex flex-col gap-0.5 leading-tight">
              <li>
                <span className="tabular-nums font-medium">{hover.stat.turns}</span>{" "}
                Nachrichten
              </li>
              <li>
                <span className="tabular-nums font-medium">{hover.stat.perfectTurns}</span>{" "}
                perfekt
                {hover.stat.turns > 0 && (
                  <span className="text-amber-700/80">
                    {" "}
                    ({Math.round((hover.stat.perfectTurns / hover.stat.turns) * 100)}%)
                  </span>
                )}
              </li>
              <li>
                <span className="tabular-nums font-medium">{hover.stat.errors}</span>{" "}
                Fehler
              </li>
              <li>
                <span className="tabular-nums font-medium">{hover.stat.points}</span>{" "}
                Punkte
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
