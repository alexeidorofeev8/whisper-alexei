"use client";

import { useAppStore } from "@/store/useAppStore";

const LEVEL_COLORS: Record<string, string> = {
  A2: "text-slate-600 bg-slate-100 border border-slate-200",
  B1: "text-blue-700 bg-blue-50 border border-blue-200",
  B2: "text-indigo-700 bg-indigo-50 border border-indigo-200",
  C1: "text-violet-700 bg-violet-50 border border-violet-200",
  C2: "text-orange-700 bg-orange-50 border border-orange-200",
};

export function SessionStats() {
  const totalErrors = useAppStore((s) => s.totalErrors);
  const sessionLevel = useAppStore((s) => s.sessionLevel);
  const targetLanguage = useAppStore((s) => s.targetLanguage);

  const errorsLabel =
    targetLanguage === "en"
      ? `${totalErrors} error${totalErrors === 1 ? "" : "s"} corrected`
      : `${totalErrors} Fehler korrigiert`;

  return (
    <div className="flex items-center gap-2">
      {totalErrors > 0 && (
        <span className="text-xs text-slate-400">{errorsLabel}</span>
      )}
    </div>
  );
}
