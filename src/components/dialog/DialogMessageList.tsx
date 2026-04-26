"use client";

import { useEffect, useRef } from "react";
import { DialogTurn, Message } from "@/lib/types";
import { UserBubble } from "@/components/chat/UserBubble";
import { AnalysisBubble } from "@/components/chat/AnalysisBubble";
import { AiBubble } from "@/components/chat/AiBubble";
import { useAppStore } from "@/store/useAppStore";

interface DialogMessageListProps {
  turns: DialogTurn[];
  isLoading: boolean;
}

/** Adapt a DialogTurn into the legacy Message shape that chat bubbles expect. */
function asUserMessage(t: DialogTurn): Message {
  return {
    id: t.id + ":user",
    role: "user",
    timestamp: t.timestamp,
    transcript: t.text,
  };
}

function asAnalysisMessage(t: DialogTurn): Message | null {
  if (!t.analysis) return null;
  return {
    id: t.id + ":analysis",
    role: "analysis",
    timestamp: t.timestamp,
    analysis: t.analysis,
  };
}

function asAiMessage(t: DialogTurn): Message {
  return {
    id: t.id + ":ai",
    role: "ai",
    timestamp: t.timestamp,
    aiText: t.text,
  };
}

export function DialogMessageList({ turns, isLoading }: DialogMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const isAnalyzing = useAppStore((s) => s.isAnalyzing);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns.length, isAnalyzing, isLoading]);

  return (
    <div className="flex flex-col gap-4 py-4">
      {turns.map((turn) => {
        if (turn.role === "user") {
          const userMsg = asUserMessage(turn);
          const analysisMsg = asAnalysisMessage(turn);
          return (
            <div key={turn.id} className="flex flex-col gap-3">
              <UserBubble message={userMsg} />
              {analysisMsg && <AnalysisBubble message={analysisMsg} />}
            </div>
          );
        }
        return <AiBubble key={turn.id} message={asAiMessage(turn)} />;
      })}

      {(isLoading || isAnalyzing) && (
        <div className="px-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-4 py-2 shadow-sm">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
