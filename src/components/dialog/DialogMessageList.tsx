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
            <div key={turn.id} className="flex flex-col gap-2">
              {/* User bubble (what they actually said) */}
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end px-4"
              >
                <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-orange-100 px-4 py-2.5 text-sm text-orange-900 shadow-sm whitespace-pre-wrap">
                  {turn.text}
                </div>
              </motion.div>

              {/* Compact correction (only if analysis exists) */}
              {turn.analysis && <DialogCorrection analysis={turn.analysis} />}
            </div>
          );
        }
        // assistant turn (in-role reply or opener)
        return (
          <motion.div
            key={turn.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start px-4"
          >
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm whitespace-pre-wrap">
              {turn.text}
            </div>
          </motion.div>
        );
      })}

      {(isLoading || isAnalyzing) && (
        <div className="px-4">
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
