"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { MessageList } from "./MessageList";
import { VoiceInput } from "@/components/voice/VoiceInput";
import { TranslationInterface } from "@/components/translation/TranslationInterface";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useAppStore } from "@/store/useAppStore";

export function ChatInterface() {
  const { analyze } = useAnalysis();
  const translationMode = useAppStore((s) => s.translationMode);

  return (
    <div className="flex flex-col h-screen bg-[#FDF8F4]">
      <AppHeader />
      <div className="flex-1 overflow-hidden flex flex-col max-w-3xl w-full mx-auto">
        {translationMode ? (
          <TranslationInterface />
        ) : (
          <>
            <MessageList />
            <div className="border-t border-slate-200 bg-white/90 backdrop-blur-xl">
              <VoiceInput onFinal={analyze} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
