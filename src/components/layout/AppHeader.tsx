"use client";

import { useAppStore } from "@/store/useAppStore";
import { SessionStats } from "./SessionStats";
import { Trash2 } from "lucide-react";

export function AppHeader() {
  const clearMessages = useAppStore((s) => s.clearMessages);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-4 h-14 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 text-xs font-bold">
          W
        </div>
        <h1 className="text-sm font-semibold text-slate-900">
          Deutsch<span className="text-teal-600">Trainer</span>
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <SessionStats />
        <button
          onClick={clearMessages}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
          aria-label="Gespräch löschen"
          title="Gespräch löschen"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
