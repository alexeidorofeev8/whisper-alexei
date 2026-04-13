"use client";

import { useAppStore } from "@/store/useAppStore";
import { TranslationPhrase, TranslationResult } from "@/lib/types";

export function useTranslation() {
  const {
    addMessage,
    setIsAnalyzing,
    setCurrentPhrase,
    clearTranslationHistory,
    currentPhrase,
    translationDifficulty,
    targetLanguage,
    incrementErrors,
  } = useAppStore();

  const fetchPhrase = async () => {
    clearTranslationHistory();
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/phrase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty: translationDifficulty, targetLanguage }),
      });

      if (!res.ok) throw new Error("Phrase generation failed");
      const phrase: TranslationPhrase = await res.json();
      setCurrentPhrase(phrase);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const evaluate = async (rawTranscript: string) => {
    if (!currentPhrase) return;

    const userTranslation =
      rawTranscript.charAt(0).toUpperCase() + rawTranscript.slice(1);

    addMessage({
      id: crypto.randomUUID(),
      role: "user",
      timestamp: Date.now(),
      transcript: userTranslation,
    });

    setIsAnalyzing(true);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          russian: currentPhrase.russian,
          userTranslation,
          targetLanguage,
          difficulty: translationDifficulty,
        }),
      });

      if (!res.ok) throw new Error("Translation evaluation failed");
      const result: TranslationResult = await res.json();

      addMessage({
        id: crypto.randomUUID(),
        role: "translation",
        timestamp: Date.now(),
        translationResult: result,
      });

      incrementErrors(result.errors.length);
    } catch (err) {
      console.error(err);
      const errorMsg =
        targetLanguage === "en"
          ? "Sorry, there was a technical error. Please try again."
          : "Es tut mir leid, es gab einen technischen Fehler. Bitte versuche es noch einmal.";
      addMessage({
        id: crypto.randomUUID(),
        role: "ai",
        timestamp: Date.now(),
        aiText: errorMsg,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { fetchPhrase, evaluate };
}
