"use client";

import { useCallback, useState } from "react";
import { CorrectionResult } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";

export function useCorrection() {
  const setIsAnalyzing = useAppStore((s) => s.setIsAnalyzing);
  const [result, setResult] = useState<CorrectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<string | null>(null);

  const correct = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setIsAnalyzing(true);
      setError(null);
      setLastInput(trimmed);
      try {
        const res = await fetch("/api/correct", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: trimmed }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.detail || body.error || `HTTP ${res.status}`);
        }
        const data: CorrectionResult = await res.json();
        setResult(data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [setIsAnalyzing]
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLastInput(null);
  }, []);

  return { result, error, lastInput, correct, reset };
}
