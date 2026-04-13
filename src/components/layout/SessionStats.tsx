"use client";

import { useAppStore } from "@/store/useAppStore";

const LEVEL_COLORS: Record<string, string> = {
  A2: "text-zinc-400 bg-zinc-800",
  B1: "text-blue-300 bg-blue-500/15",
  B2: "text-indigo-300 bg-indigo-500/15",
  C1: "text-violet-300 bg-violet-500/15",
  C2: "text-emerald-300 bg-emerald-500/15",
};

export function SessionStats() {
  const totalErrors = useAppStore((s) => s.totalErrors);
  const sessionLevel = useAppStore((s) => s.sessionLevel);

  return (
    <div className="flex items-center gap-2">
      {totalErrors > 0 && (
        <span className="text-xs text-zinc-500">
          {totalErrors} Fehler korrigiert
        </span>
      )}
      <span
        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${LEVEL_COLORS[sessionLevel] ?? "text-zinc-400 bg-zinc-800"}`}
      >
        {sessionLevel}
      </span>
    </div>
  );
}
