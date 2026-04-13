"use client";

import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useTranslation } from "@/hooks/useTranslation";
import { TranslationDifficulty } from "@/lib/types";
import { TranslationPhraseCard } from "./TranslationPhraseCard";
import { TranslationFeedback } from "./TranslationFeedback";
import { VoiceInput } from "@/components/voice/VoiceInput";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { useAutoScroll } from "@/hooks/useAutoScroll";

const DIFFICULTIES: { value: TranslationDifficulty; label: string }[] = [
  { value: "easy", label: "Лёгкий" },
  { value: "medium", label: "Средний" },
  { value: "hard", label: "Сложный" },
];

export function TranslationInterface() {
  const {
    currentPhrase,
    translationDifficulty,
    setTranslationDifficulty,
    messages,
    isAnalyzing,
  } = useAppStore();

  const { fetchPhrase, evaluate } = useTranslation();
  const { bottomRef } = useAutoScroll();

  const translationMessages = messages.filter(
    (m) => m.role === "user" || m.role === "translation"
  );

  const hasResult = translationMessages.some((m) => m.role === "translation");

  return (
    <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-5 px-4">

      {/* Top row: difficulty pills + next-phrase button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.value}
              onClick={() => setTranslationDifficulty(d.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                translationDifficulty === d.value
                  ? "bg-orange-100 text-orange-600 border-orange-200"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Next phrase — visible once a phrase exists */}
        <AnimatePresence>
          {currentPhrase && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={fetchPhrase}
              disabled={isAnalyzing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-medium hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
              Следующая
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Current phrase or prompt to start */}
      <AnimatePresence mode="wait">
        {currentPhrase ? (
          <TranslationPhraseCard key={currentPhrase.id} phrase={currentPhrase} />
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center gap-4 py-12 text-center"
          >
            <p className="text-slate-400 text-sm">
              Нажмите кнопку, чтобы получить фразу для перевода
            </p>
            <button
              onClick={fetchPhrase}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-orange-100 text-orange-600 text-sm font-medium hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isAnalyzing ? "animate-spin" : ""}`} />
              Получить фразу
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exchange history */}
      {translationMessages.map((msg) => {
        if (msg.role === "user") {
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end"
            >
              <div className="max-w-[75%] bg-orange-100 text-orange-900 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm">
                {msg.transcript}
              </div>
            </motion.div>
          );
        }
        if (msg.role === "translation" && msg.translationResult) {
          return (
            <TranslationFeedback key={msg.id} result={msg.translationResult} />
          );
        }
        return null;
      })}

      {isAnalyzing && <TypingIndicator />}

      <div ref={bottomRef} />

      {/* Sticky mic */}
      <div className="border-t border-slate-200 bg-white/90 backdrop-blur-xl -mx-4 px-4 mt-auto sticky bottom-0">
        <VoiceInput onFinal={evaluate} />
      </div>
    </div>
  );
}
