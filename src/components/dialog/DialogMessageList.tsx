"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { DialogTurn } from "@/lib/types";
import { DialogCorrection } from "./DialogCorrection";
import { useAppStore } from "@/store/useAppStore";

interface DialogMessageListProps {
  turns: DialogTurn[];
  role: string;
  isLoading: boolean;
}

interface TurnGroup {
  user?: DialogTurn;
  assistant?: DialogTurn;
  key: string;
}

/** Pair user→assistant turns into one group; standalone assistant turns (the opener) become their own group. */
function groupTurns(turns: DialogTurn[]): TurnGroup[] {
  const groups: TurnGroup[] = [];
  for (let i = 0; i < turns.length; i++) {
    const t = turns[i];
    if (t.role === "user") {
      const next = turns[i + 1];
      if (next && next.role === "assistant") {
        groups.push({ user: t, assistant: next, key: t.id });
        i++;
      } else {
        groups.push({ user: t, key: t.id });
      }
    } else {
      groups.push({ assistant: t, key: t.id });
    }
  }
  return groups;
}

export function DialogMessageList({ turns, role, isLoading }: DialogMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const isAnalyzing = useAppStore((s) => s.isAnalyzing);

  const groups = useMemo(() => groupTurns(turns), [turns]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns.length, isAnalyzing, isLoading]);

  return (
    <div className="flex flex-col gap-4 py-4">
      {groups.map((g) => {
        if (g.user) {
          return (
            <DialogCorrection
              key={g.key}
              originalText={g.user.text}
              analysis={g.user.analysis}
              assistantText={g.assistant?.text}
              assistantRole={role}
            />
          );
        }
        // Standalone assistant turn — typically the scenario opener
        const a = g.assistant!;
        return (
          <motion.div
            key={g.key}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto w-full max-w-6xl px-4"
          >
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm whitespace-pre-wrap">
                {a.text}
              </div>
            </div>
          </motion.div>
        );
      })}

      {(isLoading || isAnalyzing) && (
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400"
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
