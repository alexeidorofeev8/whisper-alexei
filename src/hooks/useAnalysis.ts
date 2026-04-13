"use client";

import { useAppStore } from "@/store/useAppStore";
import { AnalysisResult } from "@/lib/types";

export function useAnalysis() {
  const { addMessage, setIsAnalyzing, incrementErrors, setSessionLevel, targetLanguage } =
    useAppStore();

  const analyze = async (rawTranscript: string) => {
    // Speech API transcribes in lowercase — capitalise the first letter
    const transcript =
      rawTranscript.charAt(0).toUpperCase() + rawTranscript.slice(1);

    addMessage({
      id: crypto.randomUUID(),
      role: "user",
      timestamp: Date.now(),
      transcript,
    });

    setIsAnalyzing(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, targetLanguage }),
      });

      if (!res.ok) throw new Error("Analysis failed");
      const result: AnalysisResult = await res.json();

      addMessage({
        id: crypto.randomUUID(),
        role: "analysis",
        timestamp: Date.now(),
        analysis: result,
      });

      setTimeout(() => {
        addMessage({
          id: crypto.randomUUID(),
          role: "ai",
          timestamp: Date.now(),
          aiText: result.ai_response,
        });
      }, 300);

      incrementErrors(result.errors.length);
      setSessionLevel(result.level_assessment);
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

  return { analyze };
}
