"use client";

import { useAppStore } from "@/store/useAppStore";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { UserBubble } from "./UserBubble";
import { AnalysisBubble } from "./AnalysisBubble";
import { AiBubble } from "./AiBubble";
import { TypingIndicator } from "./TypingIndicator";

export function MessageList() {
  const messages = useAppStore((s) => s.messages);
  const isAnalyzing = useAppStore((s) => s.isAnalyzing);
  const { bottomRef } = useAutoScroll();

  return (
    <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-5">
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-16">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center mb-4">
            <span className="text-2xl">🎙️</span>
          </div>
          <h2 className="text-slate-900 font-semibold mb-2">
            Willkommen beim Deutschtraining
          </h2>
          <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
            Klicke auf den Mikrofon-Button und sprich einen deutschen Satz. Ich
            analysiere deine Grammatik und helfe dir, besser zu werden.
          </p>
        </div>
      )}

      {messages.map((msg) => {
        if (msg.role === "user") return <UserBubble key={msg.id} message={msg} />;
        if (msg.role === "analysis") return <AnalysisBubble key={msg.id} message={msg} />;
        if (msg.role === "ai") return <AiBubble key={msg.id} message={msg} />;
        return null;
      })}

      {isAnalyzing && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
