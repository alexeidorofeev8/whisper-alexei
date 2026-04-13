"use client";

import { useAppStore } from "@/store/useAppStore";
import { SessionStats } from "./SessionStats";
import { Trash2 } from "lucide-react";
import { TargetLanguage } from "@/lib/types";

function LanguageSwitcher() {
  const targetLanguage = useAppStore((s) => s.targetLanguage);
  const setTargetLanguage = useAppStore((s) => s.setTargetLanguage);
  const clearMessages = useAppStore((s) => s.clearMessages);

  const handleSwitch = (lang: TargetLanguage) => {
    if (lang === targetLanguage) return;
    setTargetLanguage(lang);
    clearMessages();
  };

  return (
    <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden text-xs font-semibold">
      <button
        onClick={() => handleSwitch("en")}
        className={`px-2.5 py-1 transition-colors ${
          targetLanguage === "en"
            ? "bg-orange-100 text-orange-500"
            : "text-slate-500 hover:bg-slate-50"
        }`}
        title="English"
      >
        EN
      </button>
      <button
        onClick={() => handleSwitch("de")}
        className={`px-2.5 py-1 transition-colors ${
          targetLanguage === "de"
            ? "bg-orange-100 text-orange-500"
            : "text-slate-500 hover:bg-slate-50"
        }`}
        title="Deutsch"
      >
        DE
      </button>
    </div>
  );
}

function ModeTabs() {
  const translationMode = useAppStore((s) => s.translationMode);
  const setTranslationMode = useAppStore((s) => s.setTranslationMode);

  return (
    <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium">
      <button
        onClick={() => setTranslationMode(true)}
        className={`px-3 py-1 rounded-md transition-all ${
          translationMode
            ? "bg-white text-slate-800 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        🌐 Перевод
      </button>
      <button
        onClick={() => setTranslationMode(false)}
        className={`px-3 py-1 rounded-md transition-all ${
          !translationMode
            ? "bg-white text-slate-800 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        💬 Разговор
      </button>
    </div>
  );
}

export function AppHeader() {
  const clearMessages = useAppStore((s) => s.clearMessages);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-4 h-14 border-b border-slate-200 bg-white/80 backdrop-blur-xl gap-3">
      {/* Logo */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500 text-xs font-bold">
          L
        </div>
        <h1 className="text-sm font-semibold text-slate-900">
          Lingua<span className="text-orange-400">Flow</span>
        </h1>
      </div>

      {/* Mode tabs — center */}
      <ModeTabs />

      {/* Right controls */}
      <div className="flex items-center gap-2 shrink-0">
        <SessionStats />
        <LanguageSwitcher />
        <button
          onClick={clearMessages}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
          aria-label="Clear conversation"
          title="Clear conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
