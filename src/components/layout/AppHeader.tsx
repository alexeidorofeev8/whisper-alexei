"use client";

import { useAppStore } from "@/store/useAppStore";
import { AppMode, TargetLanguage } from "@/lib/types";

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

const MODE_TABS: { value: AppMode; label: string }[] = [
  { value: "translation", label: "🌐 Перевод" },
  { value: "conversation", label: "💬 Разговор" },
  { value: "correction", label: "✍️ Korrektur" },
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
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500 text-xs font-bold shrink-0">
          L
        </div>
        <h1 className="text-sm font-semibold text-slate-900 hidden min-[360px]:block">
          Lingua<span className="text-orange-400">Flow</span>
        </h1>
      </div>

      {/* Mode tabs and language switcher hidden for now — Korrektur is the only active mode.
          Re-enable when extending back to multi-mode UX:
          <ModeTabs />
          <div className="flex items-center gap-2 shrink-0"><LanguageSwitcher /></div>
      */}
      <div className="flex-1" />
    </header>
  );
}
