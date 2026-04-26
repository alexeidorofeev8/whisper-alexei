"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { KorrekturInterface } from "@/components/correction/KorrekturInterface";
import { DialogInterface } from "@/components/dialog/DialogInterface";
import { FortschrittInterface } from "@/components/progress/FortschrittInterface";
import { useAppStore } from "@/store/useAppStore";

export function ChatInterface() {
  const currentMode = useAppStore((s) => s.currentMode);

  return (
    <div className="flex flex-col h-screen bg-[#FDF8F4]">
      <AppHeader />
      <div className="flex-1 overflow-hidden flex flex-col w-full">
        {currentMode === "dialog" && <DialogInterface />}
        {currentMode === "correction" && <KorrekturInterface />}
        {currentMode === "progress" && <FortschrittInterface />}
      </div>
    </div>
  );
}
