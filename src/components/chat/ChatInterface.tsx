"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { KorrekturInterface } from "@/components/correction/KorrekturInterface";
import { DialogInterface } from "@/components/dialog/DialogInterface";
import { useAppStore } from "@/store/useAppStore";

function FortschrittPlaceholder() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
      <span className="text-2xl">📊</span>
      <h2 className="text-base font-semibold text-stone-700">Fortschritt</h2>
      <p className="max-w-sm text-sm text-stone-500">
        Hier wird bald deine Fehler-Analytik angezeigt: häufigste Fehlertypen,
        Regeln, an denen du arbeiten solltest, Wochen-Trend.
      </p>
      <p className="text-xs text-stone-400">Phase 2 — kommt im nächsten Schritt.</p>
    </div>
  );
}

export function ChatInterface() {
  const currentMode = useAppStore((s) => s.currentMode);

  return (
    <div className="flex flex-col h-screen bg-[#FDF8F4]">
      <AppHeader />
      <div className="flex-1 overflow-hidden flex flex-col max-w-5xl w-full mx-auto">
        {currentMode === "dialog" && <DialogInterface />}
        {currentMode === "correction" && <KorrekturInterface />}
        {currentMode === "progress" && <FortschrittPlaceholder />}
      </div>
    </div>
  );
}
