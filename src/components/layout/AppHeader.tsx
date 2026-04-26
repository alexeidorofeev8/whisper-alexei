"use client";

import { useAppStore } from "@/store/useAppStore";
import { AppMode } from "@/lib/types";

const MODE_TABS: { value: AppMode; label: string }[] = [
  { value: "dialog", label: "💬 Dialog" },
  { value: "progress", label: "📊 Fortschritt" },
];

function ModeTabs() {
  const currentMode = useAppStore((s) => s.currentMode);
  const setCurrentMode = useAppStore((s) => s.setCurrentMode);

  return (
    <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium">
      {MODE_TABS.map((t) => (
        <button
          key={t.value}
          onClick={() => setCurrentMode(t.value)}
          className={`px-2.5 sm:px-3 py-1 rounded-md transition-all ${
            currentMode === t.value
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-3 sm:px-4 h-14 border-b border-slate-200 bg-white/80 backdrop-blur-xl gap-2 sm:gap-3">
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500 text-xs font-bold shrink-0">
          L
        </div>
        <h1 className="text-sm font-semibold text-slate-900 hidden min-[360px]:block">
          Lingua<span className="text-orange-400">Flow</span>
        </h1>
      </div>

      <ModeTabs />

      <div className="flex-1 flex justify-end" />
    </header>
  );
}
