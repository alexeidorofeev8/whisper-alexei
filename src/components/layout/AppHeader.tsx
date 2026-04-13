"use client";

import { useAppStore } from "@/store/useAppStore";
import { SessionStats } from "./SessionStats";
import { Trash2 } from "lucide-react";

export function AppHeader() {
  const clearMessages = useAppStore((s) => s.clearMessages);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-4 h-14 border-b border-white/6 bg-[#0A0B14]/80 backdrop-blur-xl">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-bold">
          W
        </div>
        <h1 className="text-sm font-semibold text-zinc-200">
          Deutsch<span className="text-indigo-400">Trainer</span>
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <SessionStats />
        <button
          onClick={clearMessages}
          className="text-zinc-600 hover:text-zinc-400 transition-colors p-1.5 rounded-lg hover:bg-white/5"
          aria-label="Gespräch löschen"
          title="Gespräch löschen"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
