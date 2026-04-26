"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { DialogTurn } from "@/lib/types";
import { DialogCorrection } from "./DialogCorrection";
import { useAppStore } from "@/store/useAppStore";

interface DialogMessageListProps {
  turns: DialogTurn[];
  isLoading: boolean;
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
          return (
            <DialogCorrection
              key={turn.id}
              originalText={turn.text}
              analysis={turn.analysis}
            />
          );
        }
        // assistant turn (in-role reply or opener)
        return (
          <motion.div
            key={turn.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto w-full max-w-6xl px-4"
          >
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm whitespace-pre-wrap">
                {turn.text}
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
